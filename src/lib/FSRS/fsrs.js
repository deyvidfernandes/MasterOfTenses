  // Usage: import { FSRS } from './lib/fsrs.js';
  /**
   * @enum {number}
   */
  export const State = {
    New: 0,
    Learning: 1,
    Review: 2,
    Relearning: 3,
  };

  /**
   * @enum {number}
   */
  export const Rating = {
    Again: 1,
    Hard: 2,
    Good: 3,
    Easy: 4,
  };

  /**
   * @class
   */
  export class ReviewLog {
    /**
     * @param {Rating} rating
     * @param {number} scheduled_days
     * @param {number} elapsed_days
     * @param {Date} review
     * @param {State} state
     */
    constructor(rating, scheduled_days, elapsed_days, review, state) {
      this.rating = rating;
      this.elapsed_days = elapsed_days;
      this.scheduled_days = scheduled_days;
      this.review = review;
      this.state = state;
    }
  }

  /**
   * @class
   */
  export class Card {
    constructor() {
      this.due = new Date();
      this.stability = 0;
      this.difficult = 0;
      this.elapsed_days = 0;
      this.scheduled_days = 0;
      this.reps = 0;
      this.lapses = 0;
      this.state = State.New;
      this.last_review = new Date();
    }
  }

  /**
   * @class
   */
  export class SchedulingInfo {
    /**
     * @param {Card} card
     * @param {ReviewLog} review_log
     */
    constructor(card, review_log) {
      this.card = card;
      this.review_log = review_log;
    }
  }

  /**
   * @class
   */
  class SchedulingCards {
    /**
     * @param {Card} card
     */
    constructor(card) {
      this.again = { ...card };
      this.hard = { ...card };
      this.good = { ...card };
      this.easy = { ...card };
    }

    /**
     * @param {State} state
     */
    update_state(state) {
      if (state === State.New) {
        this.again.state = State.Learning;
        this.hard.state = State.Learning;
        this.good.state = State.Learning;
        this.easy.state = State.Review;
      } else if (state === State.Learning || state === State.Relearning) {
        this.again.state = state;
        this.hard.state = state;
        this.good.state = State.Review;
        this.easy.state = State.Review;
      } else if (state === State.Review) {
        this.again.state = State.Relearning;
        this.hard.state = State.Review;
        this.good.state = State.Review;
        this.easy.state = State.Review;
        this.again.lapses += 1;
      }
    }

    /**
     * @param {Date} now
     * @param {number} hard_interval
     * @param {number} good_interval
     * @param {number} easy_interval
     */
    schedule(now, hard_interval, good_interval, easy_interval) {
      this.again.scheduled_days = 0;
      this.hard.scheduled_days = hard_interval;
      this.good.scheduled_days = good_interval;
      this.easy.scheduled_days = easy_interval;

      this.again.due = new Date(now.getTime() + 5 * 60 * 1000);
      if (hard_interval > 0) {
        this.hard.due = new Date(
          now.getTime() + hard_interval * 24 * 60 * 60 * 1000
        );
      } else {
        this.hard.due = new Date(now.getTime() + 10 * 60 * 1000);
      }
      this.good.due = new Date(
        now.getTime() + good_interval * 24 * 60 * 60 * 1000
      );
      this.easy.due = new Date(
        now.getTime() + easy_interval * 24 * 60 * 60 * 1000
      );
    }

    /**
     * @param {Card} card
     * @param {Date} now
     * @returns {Record<Rating, SchedulingInfo>}
     */
    record_log(card, now) {
      return {
        [Rating.Again]: new SchedulingInfo(
          this.again,
          new ReviewLog(
            Rating.Again,
            this.again.scheduled_days,
            card.elapsed_days,
            now,
            card.state
          )
        ),
        [Rating.Hard]: new SchedulingInfo(
          this.hard,
          new ReviewLog(
            Rating.Hard,
            this.hard.scheduled_days,
            card.elapsed_days,
            now,
            card.state
          )
        ),
        [Rating.Good]: new SchedulingInfo(
          this.good,
          new ReviewLog(
            Rating.Good,
            this.good.scheduled_days,
            card.elapsed_days,
            now,
            card.state
          )
        ),
        [Rating.Easy]: new SchedulingInfo(
          this.easy,
          new ReviewLog(
            Rating.Easy,
            this.easy.scheduled_days,
            card.elapsed_days,
            now,
            card.state
          )
        ),
      };
    }
  }

  /**
   * @class
   */
  class Params {
    constructor() {
      this.request_retention = 0.9;
      this.maximum_interval = 36500;
      this.w = [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61]
    }
  }

  /**
   * @class
   */
  export class FSRS {
    constructor() {
      this.p = new Params();
    }

    /**
     * @param {Card} card
     * @param {Date} now
     * @returns {Record<number, SchedulingInfo>}
     */
    repeat(card, now) {
      card = { ...card };
      if (card.state === State.New) {
        card.elapsed_days = 0;
      } else {
        card.elapsed_days =
          (now.getTime() - card.last_review.getTime()) / 86400000;
      }
      card.last_review = now;
      card.reps += 1;
      let s = new SchedulingCards(card);
      s.update_state(card.state);
      if (card.state === State.New) {
        this.init_ds(s);
        s.again.due = new Date(now.getTime() + 60 * 1000);
        s.hard.due = new Date(now.getTime() + 5 * 60 * 1000);
        s.good.due = new Date(now.getTime() + 10 * 60 * 1000);
        let easy_interval = this.next_interval(s.easy.stability);
        s.easy.scheduled_days = easy_interval;
        s.easy.due = new Date(
          now.getTime() + easy_interval * 24 * 60 * 60 * 1000
        );
      } else if (
        card.state === State.Learning ||
        card.state === State.Relearning
      ) {
        let hard_interval = 0;
        let good_interval = this.next_interval(s.good.stability);
        let easy_interval = Math.max(
          this.next_interval(s.easy.stability),
          good_interval + 1
        );
        s.schedule(now, hard_interval, good_interval, easy_interval);
      } else if (card.state === State.Review) {
        let interval = card.elapsed_days;
        let last_d = card.difficult;
        let last_s = card.stability;
        let retrievability = Math.pow(1 + interval / (9 * last_s), -1);
        this.next_ds(s, last_d, last_s, retrievability);
        let hard_interval = this.next_interval(s.hard.stability);
        let good_interval = this.next_interval(s.good.stability);
        hard_interval = Math.min(hard_interval, good_interval);
        good_interval = Math.max(good_interval, hard_interval + 1);
        let easy_interval = Math.max(
          this.next_interval(s.easy.stability),
          good_interval + 1
        );
        s.schedule(now, hard_interval, good_interval, easy_interval);
      }
      return s.record_log(card, now);
    }

    /**
     * @param {SchedulingCards} s
     */
    init_ds(s) {
      s.again.difficult = this.init_difficult(Rating.Again);
      s.again.stability = this.init_stability(Rating.Again);
      s.hard.difficult = this.init_difficult(Rating.Hard);
      s.hard.stability = this.init_stability(Rating.Hard);
      s.good.difficult = this.init_difficult(Rating.Good);
      s.good.stability = this.init_stability(Rating.Good);
      s.easy.difficult = this.init_difficult(Rating.Easy);
      s.easy.stability = this.init_stability(Rating.Easy);
    }

    /**
     * @param {SchedulingCards} s
     * @param {number} last_d
     * @param {number} last_s
     * @param {number} retrievability
     */
    next_ds(s, last_d, last_s, retrievability) {
      s.again.difficult = this.next_difficult(last_d, Rating.Again);
      s.again.stability = this.next_forget_stability(
        last_d,
        last_s,
        retrievability
      );
      s.hard.difficult = this.next_difficult(last_d, Rating.Hard);
      s.hard.stability = this.next_recall_stability(
        last_d,
        last_s,
        retrievability,
        Rating.Hard
      );
      s.good.difficult = this.next_difficult(last_d, Rating.Good);
      s.good.stability = this.next_recall_stability(
        last_d,
        last_s,
        retrievability,
        Rating.Good
      );
      s.easy.difficult = this.next_difficult(last_d, Rating.Easy);
      s.easy.stability = this.next_recall_stability(
        last_d,
        last_s,
        retrievability,
        Rating.Easy
      );
    }

    /**
     * @param {number} r
     * @returns {number}
     */
    init_stability(r) {
      return Math.max(this.p.w[r - 1], 0.1);
    }

    /**
     * @param {number} r
     * @returns {number}
     */
    init_difficult(r) {
      return Math.min(
        Math.max(this.p.w[4] - this.p.w[5] * (r - 3), 1),
        10
      );
    }

    /**
     * @param {number} s
     * @returns {number}
     */
    next_interval(s) {
      const interval = s * 9 * (1 / this.p.request_retention - 1);
      return Math.min(
        Math.max(Math.round(interval), 1),
        this.p.maximum_interval
      );
    }

    /**
     * @param {number} d
     * @param {number} r
     * @returns {number}
     */
    next_difficult(d, r) {
      const next_d = d - this.p.w[6] * (r - 3);
      return Math.min(
        Math.max(this.mean_reversion(this.p.w[4], next_d), 1),
        10
      );
    }

    /**
     * @param {number} init
     * @param {number} current
     * @returns {number}
     */
    mean_reversion(init, current) {
      return this.p.w[7] * init + (1 - this.p.w[7]) * current;
    }

    /**
     * @param {number} d
     * @param {number} s
     * @param {number} r
     * @param {number} rating
     * @returns {number}
     */
    next_recall_stability(d, s, r, rating) {
      const hard_penalty = rating === Rating.Hard ? this.p.w[15] : 1;
      const easy_bonus = rating === Rating.Easy ? this.p.w[16] : 1;
      return (
        s *
        (1 +
          Math.exp(this.p.w[8]) *
            (11 - d) *
            s ** -this.p.w[9] *
            (Math.exp((1 - r) * this.p.w[10]) - 1) *
            hard_penalty *
            easy_bonus)
      );
    }

    /**
     * @param {number} d
     * @param {number} s
     * @param {number} r
     * @returns {number}
     */
    next_forget_stability(d, s, r) {
      return (
        this.p.w[11] *
        Math.pow(d, -this.p.w[12]) *
        (Math.pow(s + 1, this.p.w[13]) - 1) *
        Math.exp((1 - r) * this.p.w[14])
      );
    }
  }

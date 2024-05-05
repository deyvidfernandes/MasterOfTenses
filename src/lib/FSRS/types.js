/**
 * @typedef {Object} RepetitionInfo - Um objeto contendo os dados a serem inseridos.
 * @property {number} dados.verb_id - O ID do verbo (INT NOT NULL).
 * @property {string} dados.expires - A data de expiração (no formato 'AAAA-MM-DD') (DATE NOT NULL).
 * @property {number} dados.stability - O valor de estabilidade (FLOAT NOT NULL).
 * @property {number} dados.difficult - O valor de dificuldade (FLOAT NOT NULL).
 * @property {number} dados.repetitions - O número de repetições (INT NOT NULL).
 * @property {number} dados.lapses - O número de falhas (INT NOT NULL).
 * @property {number} dados.learning_state - O estado de aprendizado (INT NOT NULL).
 * @property {string} dados.last_review - A data da última revisão (no formato 'AAAA-MM-DD') (DATE NOT NULL).
 */

export const Types = {}
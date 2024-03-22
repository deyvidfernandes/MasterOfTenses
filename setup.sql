-- Criação do banco de dados
CREATE DATABASE Master_of_tenses;

-- Uso do banco de dados criado
USE Master_of_tenses;

-- Criação da tabela Usuário
CREATE TABLE table_user (
   email VARCHAR(100) PRIMARY KEY,
   user_name VARCHAR(100) NOT NULL,
   user_password VARCHAR(100) NOT NULL,
   register_date DATE NOT NULL,
   verb_register_json JSON
);

-- Criação da tabela VerboEmEstudo
CREATE TABLE user_verb_in_study (
   user_email VARCHAR(100) NOT NULL
   verb_id INT NOT NULL,
   expires DATE NOT NULL,
   stability FLOAT NOT NULL,
   difficult FLOAT NOT NULL,
   repetitions INT NOT NULL,
   lapses INT NOT NULL,
   learning_state INT NOT NULL,
   last_review DATE NOT NULL

   CONSTRAINT fk_user_verb_in_study_user 
      FOREIGN KEY (user_email) 
      REFERENCES table_user(email), 
   CONSTRAINT fk_user_verb_in_study_verb 
      FOREIGN KEY (verb_id) 
      REFERENCES verb(id), 

);

-- Criação da tabela Verbo
CREATE TABLE verb (
   id INT AUTO_INCREMENT PRIMARY KEY,
   definitions TEXT,
   phonetics VARCHAR(100) NOT NULL,
   usageIndex DOUBLE NOT NULL,
   infinitive VARCHAR(50) NOT NULL,
   infinitive_audio VARCHAR(100),

   simple_past VARCHAR(50) NOT NULL,
   simple_past_audio VARCHAR(100)
   simple_past_uk VARCHAR(50),
   simple_past_uk_audio VARCHAR(100),

   participle VARCHAR(50) NOT NULL,
   participle_audio VARCHAR(100)
   participle_uk VARCHAR(50),
   participle_uk_audio VARCHAR(100),
);

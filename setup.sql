-- Criação do banco de dados
CREATE DATABASE Master_of_tenses;

-- Uso do banco de dados criado
USE Master_of_tenses;

-- Criação da tabela Usuário
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    verbosEmEstudo VARCHAR(100),
    senha VARCHAR(100)
);

-- Criação da tabela VerboEmEstudo
CREATE TABLE VerboEmEstudo (
    idVerbo INT,
    vencimento DATE,
    estabilidade FLOAT,
    dificuldade FLOAT,
    repeticoes INT,
    esquecimentos INT,
    estado INT,
    ultimaRevisao DATE
);

-- Criação da tabela Verbo
CREATE TABLE Verbo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    definicoes TEXT,
    fonetica VARCHAR(100),
    indiceDeUso DOUBLE,
    infinitivo VARCHAR(100),
    infinitivoAudioURL VARCHAR(255),
    passadoSimples VARCHAR(100),
    passadoSimplesUK VARCHAR(100),
    passadoSimplesUKAudioURL VARCHAR(255),
    Particípio VARCHAR(100),
    participioUK VARCHAR(100),
    participioUKAudioURL VARCHAR(255),
    participioAudioURL VARCHAR(255)
);

-- Criação da tabela Sistema
CREATE TABLE Sistema (
    banco_Dados VARCHAR(100),
    traduzirVerbo VARCHAR(100),
    obterTodosOsVerbos VARCHAR(100)
);

-- Criação da tabela Administrador
CREATE TABLE Administrador (
    gerenciar CHAR,
    banco_Dados CHAR
);

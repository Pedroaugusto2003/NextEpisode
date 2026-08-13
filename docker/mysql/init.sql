USE nextepisode;

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS series (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano VARCHAR(20),
    sinopse TEXT,
    status VARCHAR(20) NOT NULL,
    episodiosAssistidos INT NOT NULL,
    totalEpisodios INT NOT NULL,
    duracaoEpisodio INT NOT NULL,
    imagem TEXT,
    usuario_id VARCHAR(36) NOT NULL,
    CONSTRAINT fk_series_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);
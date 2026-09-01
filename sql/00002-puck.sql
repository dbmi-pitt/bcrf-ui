CREATE TABLE puckdata (
    source VARCHAR PRIMARY KEY,
    data   JSON NOT NULL,
    FOREIGN KEY (source) REFERENCES sources(source)
);

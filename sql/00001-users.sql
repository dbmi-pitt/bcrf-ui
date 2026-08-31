CREATE TABLE users (
    email VARCHAR PRIMARY KEY,
    name VARCHAR
);

CREATE TABLE sources (
    source VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    data   JSON NOT NULL
);

CREATE TABLE groups (
    source VARCHAR,
    gid VARCHAR,
    group_name VARCHAR,
    PRIMARY KEY (source, gid),
    FOREIGN KEY (source) REFERENCES sources(source)
);

CREATE TABLE group_membership (
    source VARCHAR,
    gid VARCHAR,
    email VARCHAR,
    PRIMARY KEY (source, gid, email),
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (source) REFERENCES sources(source)
);

CREATE TABLE group_grants (
    source VARCHAR,
    grantid VARCHAR,
    gid VARCHAR,
    permission_set VARCHAR,
    PRIMARY KEY (source, grantid),
    FOREIGN KEY (source) REFERENCES sources(source)
);

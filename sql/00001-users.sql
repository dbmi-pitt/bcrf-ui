CREATE TABLE users (
    email VARCHAR NOT NULL PRIMARY KEY,
    uuid VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    organization VARCHAR
);

CREATE TABLE sources (
    source VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    data   JSON NOT NULL,
    virtual BOOLEAN NOT NULL DEFAULT FALSE
);

-- "virtual source" so "Global Read" and "Global Admin" groups can be created
INSERT INTO sources (source, name, description, data, virtual)
VALUES ('bcrf-global', 'BCRF Global', 'Virtual source representing access to all sources.', '{}', TRUE);

CREATE TABLE permissions (
    key VARCHAR NOT NULL PRIMARY KEY, 
    description VARCHAR NOT NULL
);

INSERT INTO permissions (key, description) VALUES
    ('READ', 'Read permission for the BCRF Data Hub'),
    ('ABOUT_WRITE', 'Edit permission for the wiki about page.'),
    ('ASSETS_WRITE', 'Edit permission for the assets manager.'),
    ('GLOBUS_READ', 'Read permission for the Globus data.'),
    ('GLOBUS_WRITE', 'Write permission for the Globus data.'),
    ('SOURCE_ADMIN', 'Administrative access to the source.'),
    ('SUPER_ADMIN', 'Administrative access to the entire system.');

CREATE TABLE groups (
    uuid VARCHAR NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL,
    source VARCHAR NOT NULL,
    description VARCHAR,
    FOREIGN KEY (source) REFERENCES sources(source)
);

INSERT INTO groups (uuid, name, source, description) VALUES
    ('21420174-8290-4dd5-87e7-0a70003402ad', 'BCRF Global Read', 'bcrf-global', 'Virtual group representing read access to all sources.'),
    ('d2416ff1-84ff-4087-8632-cd5a46be5a34', 'BCRF Global Admin', 'bcrf-global', 'Virtual group representing admin access to all sources.');

CREATE TABLE group_membership (
    group_uuid VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL,
    PRIMARY KEY (group_uuid, user_email),
    FOREIGN KEY (group_uuid) REFERENCES groups(uuid),
    FOREIGN KEY (user_email) REFERENCES users(email)
);

CREATE TABLE group_grants (
    group_uuid VARCHAR NOT NULL,
    permission_key VARCHAR NOT NULL,
    PRIMARY KEY (group_uuid, permission_key),
    FOREIGN KEY (group_uuid) REFERENCES groups(uuid),
    FOREIGN KEY (permission_key) REFERENCES permissions(key)
);

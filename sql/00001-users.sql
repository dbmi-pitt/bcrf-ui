SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- users
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    email           VARCHAR(255)    NOT NULL PRIMARY KEY,
    uuid            CHAR(36)        NOT NULL UNIQUE,
    name            VARCHAR(255)    NOT NULL,
    organization    VARCHAR(255),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_organization (organization)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- permissions
-- ----------------------------------------------------------------------------
CREATE TABLE permissions (
    permission_key  VARCHAR(64)     NOT NULL PRIMARY KEY,
    description     VARCHAR(255)    NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO permissions (permission_key, description) VALUES
    ('READ',          'Read permission for the BCRF Data Hub'),
    ('ABOUT_WRITE',   'Edit permission for the wiki about page.'),
    ('ASSETS_WRITE',  'Edit permission for the assets manager.'),
    ('GLOBUS_READ',   'Read permission for the Globus data.'),
    ('GLOBUS_WRITE',  'Write permission for the Globus data.'),
    ('SOURCE_ADMIN',  'Administrative access to the source.'),
    ('SUPER_ADMIN',   'Administrative access to the entire system.');

-- ----------------------------------------------------------------------------
-- sources
-- ----------------------------------------------------------------------------
CREATE TABLE sources (
    source            VARCHAR(64)   NOT NULL PRIMARY KEY, -- unique identifier for the source (aurora-us, aurora-eu, etc...)
    name              VARCHAR(255)  NOT NULL, -- human-readable name for the source
    description       VARCHAR(1024) NOT NULL, -- description of the source
    patient_count     INT           NOT NULL DEFAULT 0, -- number of total patients
    sample_count      INT           NOT NULL DEFAULT 0, -- number of total samples
    data_table_name   VARCHAR(128)  NOT NULL, -- name of the data table in the duck database
    key_column        VARCHAR(128)  NOT NULL, -- primary key column for the data table
    config            JSON          NOT NULL, -- chart configuration
    `virtual`         BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- "virtual source" so "Global Read" and "Global Admin" groups can be created
INSERT INTO sources (source, name, description, patient_count, sample_count, data_table_name, key_column, config, virtual)
VALUES ('bcrf-global', 'BCRF Global', 'Virtual source representing access to all sources.', 0, 0, '', 'id', JSON_OBJECT(), TRUE);

-- ----------------------------------------------------------------------------
-- groups
-- ----------------------------------------------------------------------------
CREATE TABLE `groups` (
    uuid          CHAR(36)      NOT NULL PRIMARY KEY,
    name          VARCHAR(255)  NOT NULL, -- human-readable name for the group
    source        VARCHAR(64)   NOT NULL, -- source to which the group belongs
    description   VARCHAR(2048), -- description of the group
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (source) REFERENCES sources(source),
    INDEX idx_groups_source (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO groups (uuid, name, source, description) VALUES
    ('21420174-8290-4dd5-87e7-0a70003402ad', 'BCRF Global Read',  'bcrf-global', 'Virtual group representing read access to all sources.'),
    ('d2416ff1-84ff-4087-8632-cd5a46be5a34', 'BCRF Global Admin', 'bcrf-global', 'Virtual group representing admin access to all sources.');

-- ----------------------------------------------------------------------------
-- group_grants
-- ----------------------------------------------------------------------------
CREATE TABLE group_grants (
    group_uuid       CHAR(36)      NOT NULL,
    permission_key   VARCHAR(64)   NOT NULL,

    PRIMARY KEY (group_uuid, permission_key),
    FOREIGN KEY (group_uuid) REFERENCES groups(uuid) ON DELETE CASCADE,
    FOREIGN KEY (permission_key) REFERENCES permissions(permission_key) ON DELETE CASCADE,

    INDEX idx_group_grants_permission_key (permission_key) -- for reverse lookup: "which groups grant this permission?"
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO group_grants (group_uuid, permission_key) VALUES
    ('21420174-8290-4dd5-87e7-0a70003402ad', 'READ'),
    ('d2416ff1-84ff-4087-8632-cd5a46be5a34', 'SUPER_ADMIN');

-- ----------------------------------------------------------------------------
-- group_membership
-- ----------------------------------------------------------------------------
CREATE TABLE group_membership (
    group_uuid   CHAR(36)      NOT NULL,
    user_email   VARCHAR(255)  NOT NULL,

    PRIMARY KEY (group_uuid, user_email),
    FOREIGN KEY (group_uuid) REFERENCES groups(uuid) ON DELETE CASCADE,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,

    INDEX idx_group_membership_user_email (user_email) -- for reverse lookup: "which groups does this user belong to?"
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- puckdata
-- ----------------------------------------------------------------------------
CREATE TABLE puckdata (
    source      VARCHAR(64)   NOT NULL PRIMARY KEY,
    data        JSON          NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (source) REFERENCES sources(source) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

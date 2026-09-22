CREATE TABLE files (
    id             CHAR(36)         NOT NULL PRIMARY KEY,
    source         VARCHAR(64)      NOT NULL,
    path           VARCHAR(512)     NOT NULL,
    path_lower     VARCHAR(512)     NOT NULL,
    storage_key    VARCHAR(512)     NOT NULL,
    original_name  VARCHAR(255)     NOT NULL,
    mime_type      VARCHAR(127)     NOT NULL,
    size           BIGINT UNSIGNED  NOT NULL,
    checksum       CHAR(64)         NOT NULL,
    uploaded_by    VARCHAR(255),
    public         BOOLEAN          NOT NULL DEFAULT FALSE,             -- public visibility flag
    logically_del  BOOLEAN          NOT NULL DEFAULT FALSE,             -- soft delete flag
    created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (source) REFERENCES sources(source)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(email)
        ON UPDATE CASCADE ON DELETE SET NULL,

    UNIQUE KEY idx_files_unique_path (source, path_lower),
    UNIQUE KEY idx_files_storage_key (storage_key),
    INDEX idx_files_source_deleted_path (source, logically_del, path),
    INDEX idx_files_source_deleted_path_lower (source, logically_del, path_lower),
    INDEX idx_files_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

import { pool } from '../database/connection';
import { Logger } from '../utils/Logger';

const logger = Logger.getLogger();

export class User {
  constructor(
    public id: number,
    public email: string,
    public password: string,
    public username: string | null = null,
 
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  async setupUser(): Promise<void> {
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(249) NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(100) DEFAULT NULL,
        status TINYINT(2) UNSIGNED NOT NULL DEFAULT 0,
        verified TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
        resettable TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,
        roles_mask INT(10) UNSIGNED NOT NULL DEFAULT 0,
        registered INT(10) UNSIGNED NOT NULL,
        last_login INT(10) UNSIGNED DEFAULT NULL,
        force_logout MEDIUMINT(7) UNSIGNED NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS users_confirmations (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id INT(10) UNSIGNED NOT NULL,
        email VARCHAR(249) NOT NULL,
        selector VARCHAR(16) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires INT(10) UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY selector (selector),
        KEY email_expires (email,expires),
        KEY user_id (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS users_remembered (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        user INT(10) UNSIGNED NOT NULL,
        selector VARCHAR(24) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires INT(10) UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY selector (selector),
        KEY user (user),
        FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS users_resets (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        user INT(10) UNSIGNED NOT NULL,
        selector VARCHAR(20) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires INT(10) UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY selector (selector),
        KEY user_expires (user,expires),
        FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS users_throttling (
        bucket VARCHAR(44) NOT NULL,
        tokens FLOAT UNSIGNED NOT NULL,
        replenished_at INT(10) UNSIGNED NOT NULL,
        expires_at INT(10) UNSIGNED NOT NULL,
        PRIMARY KEY (bucket),
        KEY expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS user_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT(10) UNSIGNED NOT NULL,
        street VARCHAR(255),
        postal VARCHAR(20),
        city VARCHAR(100),
        phone VARCHAR(20),
        country VARCHAR(100),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ];

    for (const sql of sqlStatements) {
      try {
        await pool.query(sql);
      } catch (e) {
        logger.error({
          message: 'Error executing SQL',
          sql,
          error: (e as Error).message
        });
      }
    }
  }
}

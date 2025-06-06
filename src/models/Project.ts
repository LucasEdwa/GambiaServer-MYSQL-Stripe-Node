import { pool } from "../database/connection";
import { Logger } from "../utils/Logger";

const logger = Logger.getLogger();

export class Project {
  constructor(
    public id: number,
    public name: string,
    public organization: string,
    public misson: string,
    public description: string,
    public focusArea: string, // public imageURL: string | string[]
    public pimid: string
  ) {}

  async setupProject(): Promise<void> {
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS Projects (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
        name VARCHAR(50),
        organization VARCHAR(50),
        misson VARCHAR(100),
        description VARCHAR(1000),
        focusArea VARCHAR(1000),
        pimid VARCHAR(50) UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS Images (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
        imageURL VARCHAR(100),
        projectId INT UNSIGNED,
        FOREIGN KEY (projectId) REFERENCES Projects(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    ];
    for (const sql of sqlStatements) {
      try {
        await pool.query(sql);
      } catch (e) {
        logger.error({
          message: "Error executing SQL",
          sql,
          error: (e as Error).message,
        });
      }
    }
  }
}

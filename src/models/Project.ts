import { pool } from "../database/connection";
import { Logger } from "../utils/Logger";

const logger = Logger.getLogger();


const projects = [
  {
    id: 1,
    name: "Project A",
    organization: "Organization A",
    misson: "Mission A",
    description: "Description A",
    focusArea: "Focus Area A",
    pimid: "PIMID-A",
  },
  {
    id: 2,
    name: "Project B",
    organization: "Organization B",
    misson: "Mission B",
    description: "Description B",
    focusArea: "Focus Area B",
    pimid: "PIMID-B",
  },    
]

export class Project {
  constructor(
    public id: number,
    public name: string,
    public organization: string,
    public misson: string,
    public description: string,
    public focusArea: string, 
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
    try {
      await pool.query(`ALTER TABLE Projects ADD COLUMN pimid VARCHAR(50) UNIQUE`);
    } catch (e) {
      if (!(e as any).message.includes('Duplicate column name')) {
        logger.error({
          message: "Error altering Projects table to add pimid column",
          error: (e as Error).message,
        });
      }
    }
  }
    async insertProjects(): Promise<void> {
    for (const project of projects) {
      const sql = `INSERT INTO Projects (id, name, organization, misson, description, focusArea, pimid) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, organization = ?, misson = ?, description = ?, focusArea = ?, pimid = ?`;
      try {
        await pool.query(sql, [
          project.id,
          project.name,
          project.organization,
          project.misson,
          project.description,
          project.focusArea,
          project.pimid,
          project.name,
          project.organization,
          project.misson,
          project.description,
          project.focusArea,
          project.pimid
        ]);
      } catch (e) {
        logger.error({
          message: "Error inserting or updating project",
          error: (e as Error).message,
        });
      }
    }
  }
}

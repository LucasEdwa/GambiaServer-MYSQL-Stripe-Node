import { pool } from "../database/connection";
import { Logger } from "../utils/Logger";

const logger = Logger.getLogger();

export class Donate {
  constructor(
    public id: number,
    public amount: number,
    public currency: string,
    public userId: number,
    public signatureType: string,
    public email: string,
    public mobileNumber: string,
    public donationType: string,
    public fullName: string,
    public checkedForTaxReduction: boolean,
    public companyFirstName?: string | null,
    public companyLastName?: string | null,
    public personalNumber?: string | null,
    public companyEmail?: string | null,
    public companyPhoneNumber?: string | null,
    public companyRegistrationNumber?: string | null,
    public date: Date = new Date()
  ) {}
  async setupDonate(): Promise<void> {
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS donations (
                id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                amount DECIMAL(10,2) NOT NULL,
                currency VARCHAR(3) NOT NULL,
                user_id INT(10) UNSIGNED NOT NULL,
                signature_type VARCHAR(50) NOT NULL,
                email VARCHAR(255) NOT NULL,
                mobile_number VARCHAR(20) NOT NULL,
                donation_type VARCHAR(50) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                checked_for_tax_reduction TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
                company_first_name VARCHAR(255) DEFAULT NULL,
                company_last_name VARCHAR(255) DEFAULT NULL,
                personal_number VARCHAR(20) DEFAULT NULL,
                company_email VARCHAR(255) DEFAULT NULL,
                company_phone_number VARCHAR(20) DEFAULT NULL,
                company_registration_number VARCHAR(50) DEFAULT NULL,
                date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
            `CREATE TABLE IF NOT EXISTS user_payment_data (
                id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id INT(10) UNSIGNED NOT NULL,
                donate_id INT(10) UNSIGNED NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                FOREIGN KEY (donate_id) REFERENCES donations(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    console.log("Donations and user_payment_data tables created or already exist.");
  }
}

export class UserPaymentData {
  constructor(
    public id: number,
    public userId: number,
    public donateId: number,
    public createdAt: Date = new Date()
  ) {}
}

import winston from 'winston';
import path from 'path';
import fs from 'fs';

export class Logger {
    private static instance: winston.Logger;

    private constructor() {}

    public static getLogger(): winston.Logger {
        if (!Logger.instance) {
            const logsDir = path.join(process.cwd(), 'logs');
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }
            Logger.instance = winston.createLogger({
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
                transports: [
                    new winston.transports.File({ filename: path.join(logsDir, 'errors.log') }),
                    new winston.transports.Console()
                ]
            });
        }
        return Logger.instance;
    }
}

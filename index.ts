import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import winston from 'winston';
import express, { Express } from 'express';
import { User } from './src/models/User';

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// Ensure logs directory exists
function ensureLogsDir() {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }
    return logsDir;
}

const logsDir = ensureLogsDir();

// Logger configuration
const logger = winston.createLogger({
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

// Global error handlers
process.on('uncaughtException', (err) => {
    logger.error({ message: 'Uncaught Exception', error: err.stack || err });
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error({ message: 'Unhandled Rejection', error: reason });
    process.exit(1);
});

// Create user tables at startup
(async () => {
    const user = new User('', '', '', '');
    await user.setupUser();
})();


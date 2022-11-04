// Copyright (c) 2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

/** @ignore */
const LogPath = process.env.LOG_PATH ? resolve(process.env.LOG_PATH) : resolve(process.cwd(), 'logs/');

if (!process.env.LOG_CREATE_PATH || process.env.LOG_CREATE_PATH === 'true') {
    if (!existsSync(LogPath)) {
        mkdirSync(LogPath);
    }
}

interface ILogger extends WinstonLogger {
    addLog: (filename: string, level?: string) => void;
}

const Logger: ILogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({ filename: resolve(LogPath, 'info.log') })
    ]
}) as any;

Logger.add(
    new transports.Console({
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.splat(),
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        )
    })
);

Logger.addLog = (filename: string, level?: string): void => {
    Logger.add(
        new transports.File({
            level,
            filename: resolve(LogPath, filename)
        })
    );
};

export default Logger;
export { Logger };

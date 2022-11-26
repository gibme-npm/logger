// Copyright (c) 2018-2022, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import Winston, { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
export { transports, format, Winston };

dotenv.config();

/** @ignore */
const LogPath = process.env.LOG_PATH ? resolve(process.env.LOG_PATH) : resolve(process.cwd(), 'logs/');

/** @ignore */
const LogFilename = process.env.LOG_FILENAME && process.env.LOG_FILENAME.length !== 0
    ? process.env.LOG_FILENAME
    : 'info.log';

if (!process.env.LOG_CREATE_PATH || process.env.LOG_CREATE_PATH === 'true') {
    if (!existsSync(LogPath)) {
        mkdirSync(LogPath);
    }
}

export interface ILogger extends WinstonLogger {
    /**
     * Creates a new log file with the specified filename in the specified log path
     * with the specified logging level
     *
     * @param filename
     * @param level
     * @param logPath
     */
    addLog: (filename: string, level?: string, logPath?: string) => void;
    /**
     * Returns the fully qualified default log path
     */
    path: () => string;
    /**
     * Returns the filename of the default log file
     */
    defaultFilename: () => string;
}

const _logger: ILogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({ filename: resolve(LogPath, LogFilename) })
    ]
}) as any;

_logger.path = (): string => LogPath;

_logger.defaultFilename = (): string => LogFilename;

_logger.add(
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

_logger.addLog = (filename: string, level?: string, logPath = LogPath): void => {
    Logger.add(
        new transports.File({
            level,
            filename: resolve(logPath, filename)
        })
    );
};

/**
 * A singleton instance of a Winston Logger object with a few additional methods
 */
const Logger: Readonly<ILogger> = _logger;

export default Logger;
export { Logger };

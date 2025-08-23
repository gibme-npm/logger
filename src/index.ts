// Copyright (c) 2018-2025, Brandon Lehmann <brandonlehmann@gmail.com>
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
import { config } from 'dotenv';
export { Winston, transports, format };

config();

/** @ignore */
const enableDefaultLog = process.env.ENABLE_DEFAULT_LOG?.toLowerCase() === 'true';

/** @ignore */
const LogPath = process.env.LOG_PATH ? resolve(process.env.LOG_PATH) : resolve(process.cwd(), 'logs/');

/** @ignore */
const LogFilename = process.env.LOG_FILENAME ?? 'info.log';

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
    path: Readonly<string>;
    /**
     * Returns the filename of the default log file
     */
    defaultFilename: Readonly<string>;
    /**
     * Returns the fully qualified default log file path
     */
    defaultFilenamePath: Readonly<string>;
    /**
     * Enables the default logging transport
     */
    enableDefaultLog: () => void;
    /**
     * Disables the default logging transport
     */
    disableDefaultLog: () => void;
}

/** @ignore */
const defaultTransport = new transports.File({ filename: resolve(LogPath, LogFilename) });

const _logger: ILogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}}`)
    ),
    transports: enableDefaultLog ? [defaultTransport] : []
}) as any;

const setProperty = (key: string, value: any): void => {
    (_logger as any)[key] = value;
};

_logger.enableDefaultLog = () => {
    _logger.add(defaultTransport);
};

_logger.disableDefaultLog = () => {
    _logger.remove(defaultTransport);
};

setProperty('path', LogPath);

setProperty('defaultFilename', LogFilename);

setProperty('defaultFilenamePath', resolve(_logger.path, _logger.defaultFilename));

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
    _logger.add(
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

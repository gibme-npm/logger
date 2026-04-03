# @gibme/logger

A simple [Winston](https://www.npmjs.com/package/winston) wrapper that provides a pre-configured singleton logger with console and file transports.

[![NPM](https://img.shields.io/npm/v/@gibme/logger)](https://www.npmjs.com/package/@gibme/logger)
[![License](https://img.shields.io/npm/l/@gibme/logger)](https://github.com/gibme-npm/logger/blob/master/LICENSE)
[![Node.js](https://img.shields.io/node/v/@gibme/logger)](https://nodejs.org/)

## Features

- Console transport with colorized output, enabled by default
- Debug-level console output automatically enabled when `NODE_ENV !== 'production'`
- Optional file transport with configurable path and filename
- Additional log files via `addLog()`
- Full access to underlying Winston `format`, `transports`, and `Winston` exports for advanced use

## Installation

```bash
yarn add @gibme/logger
```

or

```bash
npm install @gibme/logger
```

## Quick Start

```typescript
import Logger from '@gibme/logger';

Logger.info('Application started');
Logger.debug('Debug details here');
Logger.warn('Something looks off');
Logger.error('Something went wrong');
```

## File Logging

File logging is disabled by default. Enable it at runtime or via environment variable:

```typescript
// Enable the default file transport at runtime
Logger.enableDefaultLog();

// Disable it again
Logger.disableDefaultLog();
```

### Adding Additional Log Files

```typescript
// Add a custom log file with a specific level
Logger.addLog('errors.log', 'error');

// Specify a custom path
Logger.addLog('audit.log', 'info', '/var/log/myapp');
```

## Environment Variables

Configuration is handled through environment variables (with [dotenv](https://www.npmjs.com/package/dotenv) support):

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | — | When set to `production`, console output is limited to `info` level and above |
| `ENABLE_DEFAULT_LOG` | `false` | Set to `true` to enable the default file transport on startup |
| `LOG_PATH` | `./logs/` | Directory for log files |
| `LOG_FILENAME` | `info.log` | Filename for the default file transport |
| `LOG_CREATE_PATH` | `true` | Set to `false` to skip automatic creation of the log directory |

## Properties

| Property | Type | Description |
|---|---|---|
| `Logger.path` | `string` | The resolved default log directory path |
| `Logger.defaultFilename` | `string` | The default log filename |
| `Logger.defaultFilenamePath` | `string` | The full resolved path to the default log file |

## Exports

The package re-exports Winston internals for advanced configuration:

```typescript
import Logger, { Winston, transports, format } from '@gibme/logger';
```

## Documentation

Full API documentation is available at [https://gibme-npm.github.io/logger/](https://gibme-npm.github.io/logger/).

## License

MIT - see [LICENSE](https://github.com/gibme-npm/logger/blob/master/LICENSE) for details.

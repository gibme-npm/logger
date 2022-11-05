# Simple Logger built around [Winston](https://www.npmjs.com/package/winston)

Automatically creates a common logging facility for you both to file and console.

If NODE_ENV !== 'production', will also output debug level to the console.

```typescript
import Logger from '@gibme/logger';

Logger.info('I can log %s %sx faster', 'anything', 2);
Logger.debug('Debug message');
Logger.warn('Warning message');
Logger.error('Some error');

Logger.addLog('/somefile.log', 'crit');
```

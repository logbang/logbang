const { default: Logger } = require('..');

// create a named logger with some base context
const logger = Logger('service:api', { pid: process.pid });

logger.info('a simple message');
logger.warning('you can add some context to a log entry', { healthy: true });
logger.error('js error passed in as error key will be serialized correctly', {
  error: new Error('oops'),
  crashing: true,
});

// create a child logger which will be named service:api:db and combines the
// parent logger context with its own
const dblogger = logger.child('db', { addr: 'postgres://localhost/products' });
dblogger.debug('commiting updating product', { id: '8410' });

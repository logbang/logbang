# log!

logbang (aka log!) is a simple, structured logging library. This repository implements a logger for node.js and browsers. It also acts as the reference implementation for log!

## Install

```
npm install logbang
```

## Usage

```js
import Logger, { Level } from 'logbang';
/* or:
const { default: Logger, Level } = require('logbang');
*/

const logger = Logger('myservice', { pid: process.pid });

const add = (a, b) => {
  logger.info('adding numbers', { a, b });
  return a + b;
};
```

Consider using it in a server application like express.js:

```js
const express = require('express');
const ms = require('ms');
const onHeaders = require('on-headers');
const uuidv4 = require('uuid/v4');
const { default: Logger, Level } = require('logbang');

const app = express();

const logger = Logger('helloservice', { pid: process.pid });

// add a correlation id on incoming requests
app.use((req, res, next) => {
  const id = uuidv4();
  req.id = id;
  res.set('x-request-id', id);
  req.logger = logger.child('http', { id });
  next();
});

app.use((req, res, next) => {
  const started = Date.now();
  const { method, originalUrl } = req;
  onHeaders(res, () => {
    const d = Date.now() - started;
    const { status } = res;
    req.logger.info(`${method} $${originalUrl} -> ${status} in ${ms(d)}`, {
      duration: d,
      status,
      method,
      originalUrl,
    });
  });
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => logger.info('Example app listening on port 3000!'));
```

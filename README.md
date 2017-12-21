# log!

logbang (aka log!) is a simple, structured logging library. This repository implements a logger for node.js and browsers. It also acts as the reference implementation for log!

## Install

```
npm install logbang
```

## Usage

```js
const express = require('express');
const ms = require('ms');
const onHeaders = require('on-headers');
const prettyHrtime = require('pretty-hrtime');
const uuidv4 = require('uuid/v4');
const { default: Logger, Level } = require('..');

const app = express();

const logger = Logger('helloservice', { pid: process.pid });

// add a correlation id on incoming requests
app.use((req, res, next) => {
  const id = uuidv4();
  const { method, originalUrl } = req;
  req.id = id;
  res.set('x-request-id', id);
  req.logger = logger.child('http', {
    id,
    method,
    originalUrl,
  });
  next();
});

app.use((req, res, next) => {
  const started = process.hrtime();
  const { method, originalUrl } = req;
  onHeaders(res, () => {
    const elapsed = process.hrtime(started);
    const ns = elapsed[0] * 1e9 + elapsed[1];
    const { statusCode } = res;
    req.logger.debug(
      `${method} ${originalUrl} -> ${statusCode} in ${prettyHrtime(elapsed)}`,
      {
        duration: ns,
        status: statusCode,
      },
    );
  });
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/fail', (req, res) => {
  throw new Error('woops');
});

app.use((error, req, res, next) => {
  req.logger.error(error.message, {
    // expose err fields explicitly in log payload since some are not enumerable
    error,
  });
  res.status(500).json({ id: req.id, detail: 'Unexpected error occured' });
});

app.listen(3000, () => logger.info('Example app listening on port 3000!'));
```

const express = require('express');
const ms = require('ms');
const onHeaders = require('on-headers');
const uuidv4 = require('uuid/v4');
const { default: Logger, Level } = require('..');

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
    const { statusCode } = res;
    req.logger.info(`${method} ${originalUrl} -> ${statusCode} in ${ms(d)}`, {
      duration: d,
      statusCode,
      method,
      originalUrl,
    });
  });
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => logger.info('Example app listening on port 3000!'));

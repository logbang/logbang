import Logger, { Level } from './logger';

const DateNow = Date.now;

beforeEach(() => {
  Date.now = jest.fn(() => 1514764800000);
});

afterEach(() => {
  Date.now = DateNow;
});

test('basic logging', () => {
  const logger = Logger('testing');
  const spy = jest.spyOn(logger, 'emit');
  logger.log(Level.Info, 'hello world');
  expect(spy.mock.calls[0]).toMatchSnapshot();
});

test('basic logging with payload', () => {
  const logger = Logger('testing');
  const spy = jest.spyOn(logger, 'emit');
  logger.log(Level.Info, 'hello world', { foo: 'bar' });
  expect(spy.mock.calls[0]).toMatchSnapshot();
});

test('basic logging with context and payload', () => {
  const logger = Logger('testing', { foo: 'bar', country: 'uk' });
  const spy = jest.spyOn(logger, 'emit');
  logger.log(Level.Info, 'hello world', { foo: 'baz', cool: true });
  expect(spy.mock.calls[0]).toMatchSnapshot();
});

test('child logger with context and payload', () => {
  const logger = Logger('testing', { foo: 'bar' }).child('testchild', {
    foo: 'qux',
    hello: 'world',
    meh: true,
  });
  const spy = jest.spyOn(logger, 'emit');
  logger.log(Level.Info, 'hello world', { foo: 'baz', cool: true });
  expect(spy.mock.calls[0]).toMatchSnapshot();
});

['error', 'warning', 'info', 'debug'].forEach(level => {
  test(`provides sugar api for ${level}`, () => {
    const logger = Logger('testing');
    const spy = jest.spyOn(logger, 'emit');
    logger[level]('hello world', { foo: 'baz', cool: true });
    expect(spy.mock.calls[0]).toMatchSnapshot();
  });
});

export const FORMAT = 'logbang:1';

export enum Level {
  ERROR,
  WARNING,
  INFO,
  DEBUG,
}

export interface Payload {
  [k: string]: any;
}

export interface Logging {
  name: string;
  context: Payload;
  timestamp(): number;
  emit(p: Payload): void;
  log(l: Level, msg: string, p?: Payload): Logging;
  child(name: string, p: Payload): Logging;
}

// tslint:disable-next-line no-console
const defaultEmitter = (p: Payload) => console.log(JSON.stringify(p));
const defaultTimestamp = () => Date.now();

const makeLogger = (name: string, context: Payload = {}): Logging => {
  const logger = {
    context,
    name,
    timestamp: defaultTimestamp,
    emit: defaultEmitter,
    log(l: Level, msg: string, p?: Payload) {
      logger.emit({
        ...context,
        ...(p || {}),
        __f: FORMAT,
        time: logger.timestamp(),
        msg,
        level: l,
        logger: name,
      });
      return logger;
    },
    child(n: string, ctx: Payload) {
      return makeLogger(`${name}:${n}`, { ...context, ...ctx });
    },
  };
  return logger;
};

export default makeLogger;

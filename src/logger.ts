export const FORMAT = 'logbang:1';

export enum Level {
  Error,
  Warning,
  Info,
  Debug,
}

export interface Payload {
  [k: string]: any;
}

// tslint:disable-next-line no-console
const defaultEmitter = (p: Payload) => console.log(JSON.stringify(p));
const defaultTimestamp = () => Date.now();

const makeLogger = (name: string, context: Payload = {}) => {
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
    error(msg: string, p?: Payload) {
      return logger.log(Level.Error, msg, p);
    },
    warning(msg: string, p?: Payload) {
      return logger.log(Level.Warning, msg, p);
    },
    info(msg: string, p?: Payload) {
      return logger.log(Level.Info, msg, p);
    },
    debug(msg: string, p?: Payload) {
      return logger.log(Level.Debug, msg, p);
    },
    child(n: string, ctx: Payload) {
      return makeLogger(`${name}:${n}`, { ...context, ...ctx });
    },
  };
  return logger;
};

export default makeLogger;

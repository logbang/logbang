export const FORMAT = 'logbang:1';

export enum Level {
  Error,
  Warning,
  Info,
  Debug,
}

export interface Context {
  [k: string]: any;
}

// tslint:disable-next-line no-console
const defaultEmitter = (p: Context) => console.log(JSON.stringify(p));
const defaultTimestamp = () => Date.now();

const makeLogger = (name: string, context: Context = {}) => {
  const logger = {
    context,
    name,
    timestamp: defaultTimestamp,
    emit: defaultEmitter,
    log(l: Level, msg: string, c?: Context) {
      logger.emit({
        ctx: {
          ...context,
          ...(c || {}),
        },
        __f: FORMAT,
        time: logger.timestamp(),
        msg,
        level: l,
        logger: name,
      });
      return logger;
    },
    error(msg: string, c?: Context) {
      return logger.log(Level.Error, msg, c);
    },
    warning(msg: string, c?: Context) {
      return logger.log(Level.Warning, msg, c);
    },
    info(msg: string, c?: Context) {
      return logger.log(Level.Info, msg, c);
    },
    debug(msg: string, c?: Context) {
      return logger.log(Level.Debug, msg, c);
    },
    child(n: string, ctx: Context) {
      return makeLogger(`${name}:${n}`, { ...context, ...ctx });
    },
  };
  return logger;
};

export default makeLogger;

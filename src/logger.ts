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

const serializeError = (
  wrapped: Error & { toJSON?: (k: string | number) => any },
) => {
  return {
    toJSON(k: string | number) {
      if (wrapped.toJSON) {
        return wrapped.toJSON(k);
      }
      const { stack, name, message } = wrapped;
      return { ...wrapped, stack, name, message };
    },
  };
};

const transformers: { [k: string]: (value: any) => any } = {
  error: serializeError,
};

const transformContext = (c: Context) => {
  const transformed: Context = {};
  Object.keys(transformers).forEach(k => {
    if (!Object.prototype.hasOwnProperty.call(c, k)) {
      return;
    }
    transformed[k] = transformers[k](c[k]);
  });
  return { ...c, ...transformed };
};

const makeLogger = (name: string, context: Context = {}) => {
  const logger = {
    context,
    name,
    timestamp: defaultTimestamp,
    emit: defaultEmitter,
    log(l: Level, msg: string, c?: Context) {
      logger.emit({
        ctx: transformContext({
          ...context,
          ...(c || {}),
        }),
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

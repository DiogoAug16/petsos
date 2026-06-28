const LOG_LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel = process.env.EXPO_PUBLIC_APP_LOG_LEVEL || 'warn';
const isEnabled =
  typeof __DEV__ !== 'undefined'
    ? __DEV__ || process.env.EXPO_PUBLIC_APP_LOGS === 'true'
    : process.env.EXPO_PUBLIC_APP_LOGS === 'true';

const shouldLog = (level) => {
  if (!isEnabled) return false;
  return LOG_LEVELS[level] >= (LOG_LEVELS[configuredLevel] ?? LOG_LEVELS.warn);
};

const normalizeContext = (context) => {
  if (!context) return undefined;

  if (context instanceof Error) {
    return {
      name: context.name,
      code: context.code,
      message: context.message,
    };
  }

  if (typeof context !== 'object') return context;

  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => {
      if (value instanceof Error) {
        return [
          key,
          {
            name: value.name,
            code: value.code,
            message: value.message,
          },
        ];
      }

      return [key, value];
    }),
  );
};

const write = (level, message, context) => {
  if (!shouldLog(level)) return;

  const payload = normalizeContext(context);
  const prefix = `[PetsOS:${level}]`;

  if (payload === undefined) {
    console[level](prefix, message);
    return;
  }

  console[level](prefix, message, payload);
};

export const appLogger = {
  debug: (message, context) => write('debug', message, context),
  info: (message, context) => write('info', message, context),
  warn: (message, context) => write('warn', message, context),
  error: (message, context) => write('error', message, context),
};

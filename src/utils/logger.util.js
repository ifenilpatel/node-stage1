const fs = require('fs');
const path = require('path');

const winston = require('winston');
require('winston-daily-rotate-file');

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    important: 2,
    http: 3,
    info: 4,
    debug: 5,
    trace: 6
  }
};

winston.addColors({
  error: 'red',
  warn: 'yellow',
  important: 'magenta',
  http: 'cyan',
  info: 'green',
  debug: 'blue',
  trace: 'gray'
});

const levelFilter = (level) =>
  winston.format((info) => {
    return info.level === level ? info : false;
  })();

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`;
  })
);

const createTransport = (level) => {
  return new winston.transports.DailyRotateFile({
    dirname: logDir,
    filename: `${level}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: level === 'debug' || level === 'trace' ? '7d' : '30d',
    format: winston.format.combine(levelFilter(level), logFormat)
  });
};

const transports = [
  createTransport('error'),
  createTransport('warn'),
  createTransport('important'),
  createTransport('http'),
  createTransport('info'),
  createTransport('debug'),
  createTransport('trace')
];

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || 'info',
  transports,
  exceptionHandlers: [createTransport('error')],
  rejectionHandlers: [createTransport('error')],
  exitOnError: false
});

if (process.env.LOG_CONSOLE === 'true') {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
}

logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

logger.api = (message, meta = {}) => {
  logger.http(message, meta);
};

logger.business = (message, meta = {}) => {
  logger.important(message, meta);
};

module.exports = logger;

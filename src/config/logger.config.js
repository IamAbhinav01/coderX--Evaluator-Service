const winston = require('winston');
const { LOG_DB_URL } = require('./server.config');

const allowedTransports = [];

require('winston-mongodb');
winston.addColors({
  error: 'bold red',
  warn: 'italic yellow',
  info: 'green',
  debug: 'blue',
});

allowedTransports.push(
  new winston.transports.MongoDB({
    level: 'error',
    db: LOG_DB_URL,
    collection: 'logs',
  })
);

allowedTransports.push(
  new winston.transports.File({
    filename: `app.logs`,
    format: winston.format.json(),
  })
);

allowedTransports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        all: true,
      }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf(
        (info) =>
          `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
      )
    ),
  })
);
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: allowedTransports,
});
module.exports = logger;

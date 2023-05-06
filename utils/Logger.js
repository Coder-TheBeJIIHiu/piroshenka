const winston = require('winston');

class Logger {
  constructor() {
    // Создаем экземпляр логгера с настройками по умолчанию
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'info', // Уровень логирования для вывода в консоль
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }

  info(message) {
    this.logger.info(message);
  }

  error(message) {
    this.logger.error(message);
  }

  warn(message) {
    this.logger.warn(message);
  }

  debug(message) {
    this.logger.debug(message);
  }
}

module.exports = Logger;

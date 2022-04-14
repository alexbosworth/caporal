const prettyjson = require('@alexbosworth/prettyjson');
const Transport = require('winston-transport');
const util = require('util');
const winston = require('winston');

const CaporalTransport = class YourCustomTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(meta, callback) {
    setImmediate(() => {
      this.emit('logged', meta);
    });

    if (meta.message === undefined) {
      return callback();
    }

    let msg = meta.message;

    if (
      meta.message !== null &&
      typeof meta.message === 'object' &&
      Object.keys(meta.message).length
    ) {
      msg = "\n" + prettyjson.render(meta.message);
    }

    msg += "\n";

    const levelInt = winston.config.cli.levels[meta.level];

    const stdio = levelInt <= 1 ? 'stderr' : 'stdout';

    process[stdio].write(msg);

    callback();
  }
};

exports.createLogger = args => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new CaporalTransport()
    ],
  });

  return logger;
};

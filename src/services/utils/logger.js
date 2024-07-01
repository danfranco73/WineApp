// this file contains a middleware that adds a logger to the request object

import winston from 'winston';
import {__dirname} from './utils.js';

// custom error levels and colors
const customErrLevels = {
    levels: { debug: 5, http: 4, info: 3, warning: 2, error: 1, fatal: 0 },
    colors: { debug: 'blue', http: 'green', info: 'yellow', warning: 'red', error: 'magenta', fatal: 'cyan' }
}

// development logger with only one transport, for console
const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'debug' }),
    ]
});

// production logger with 2 transports, one for console and one for file
const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ level: 'error', filename: __dirname + '/error.log' })
    ]
});

// custom logger with 2 transports, one for console and one for file
const customLogger = new winston.createLogger({
    levels: customErrLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customErrLevels.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: 'low' }),
        new winston.transports.File({ level: 'medium', filename: __dirname + '/custom.log' })
    ]
})

const logger = process.env.NODE_ENV === 'development' ? devLogger : prodLogger;

// this is how we can use the custom logger
const addLogger = (req, res, next) => {
    req.logger = logger; // or prodLogger or customLogger (must be defined first)
    req.logger.http(`${new Date().toDateString()} ${req.method} ${req.url}`);
    next();
}

export { devLogger, prodLogger, customLogger, addLogger, logger };
/* Primero, definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor):
debug, http, info, warning, error, fatal
Después implementar un logger para desarrollo y un logger para producción, el logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola
Sin embargo, el logger del entorno productivo debería loggear sólo a partir de nivel info.
Además, el logger deberá enviar en un transporte de archivos a partir del nivel de error en un nombre “errors.log”
Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston.
Crear un endpoint /loggerTest que permita probar todos los logs
 */

// aqui creo el logger test

import express from 'express';
import winston from 'winston';
import __dirname from '../services/utils/utils.js';

const app = express();

const customErrLevels = {
    levels: { debug: 0, http: 1, info: 2, warning: 3, error: 4, fatal: 5 },
    colors: { debug: 'blue', http: 'green', info: 'yellow', warning: 'red', error: 'magenta', fatal: 'cyan' }
}

const devLogger = winston.createLogger({
    levels: customErrLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' }),
    ]
});

const prodLogger = winston.createLogger({
    levels: customErrLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ level: 'error', filename: __dirname + '/error.log' })
    ]
});

const logger = process.env.NODE_ENV === 'development' ? devLogger : prodLogger;

app.get('/loggerTest', (req, res) => {
    logger.debug('debug');
    logger.http('http');
    logger.info('info');
    logger.warning('warning');
    logger.error('error');
    logger.fatal('fatal');
    res.send('Logger test');
});

export default app;

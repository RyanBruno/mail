const {createLogger, format, transports} = require('winston');

const {combine, timestamp, label, json} = format;

const logger = createLogger({
    level: 'debug',
    format: combine(
        label({label: 'smtp'}),
        timestamp(),
        json()
    ),
    transports: [
        new transports.Console()
    ]
});

module.exports.logger = logger;

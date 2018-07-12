const net = require('net');
const EventHandler = require('events');
const Parser = require('./parser');
const Handler = require('./handler');
const Logger = require('./logger');

class Server extends EventHandler {
    /*
     * Starts the server.
     */
    constructor(config) {
        super();
        /* Saves config */
        this.config = config;

        /* Start the server */
        this.listen();
    }

    /**
     * Opens the server socket and accepts connections.
     */
    listen() {
        const server = net.createServer(client => {
            /* Set Encoding */
            client.setEncoding('ascii');

            /* Send service ready response */
            client.write('220 ' + this.config.FQDN + ' Service ready\r\n');
            Logger.info('New connection from: ' + client.remoteAddress);

            /* Handles the client */
            Handler.handle(client, this.config, buffer => {
                /* Phrase the message to be either stored or sent */
                Parser.parse(buffer, this.config, response => {
                    /* Send a response to the client */
                    switch (response) {
                        case 250:
                            client.write('250 OK\r\n');
                            break;
                        case 554:
                            client.write('554 Transaction failed\r\n');
                            break;
                        case 451:
                        default:
                            client.wrire('451 Local error in processing\r\n');
                            break;
                    }
                });
            });
        });

        server.on('error', err => {
            Logger.error('An error has occured with the server socket');
            throw err;
        });

        server.listen(this.config.port || 25, () => {
            Logger.info('Server bound to port: ' + this.config.port);
            this.emit('ready');
        });
    }
}

module.exports = Server;

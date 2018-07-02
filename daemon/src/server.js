const net = require('net');
const fs = require('fs');
const EventHandler = require('events');
const Parser = require('./parser');
const Handler = require('./handler');

class Server extends EventHandler {
    /*
     * Starts the server.
     */
    constructor(config) {
        super();
        /* Saves config */
        this.config = config;

        /* Start the server */
        fs.mkdir(this.config.mailDir, () => {
            this.listen();
        });
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
            console.error(Date.now() + ' An error has occured with the server socket');
            throw err;
        });

        server.listen(this.config.port || 25, () => {
            console.log(Date.now() + ' Server bound to port: ' + this.config.port);
            this.emit('ready');
        });
    }
}

module.exports = Server;

const net = require('net');
const fs = require('fs');
const EventHandler = require('events');
const Parser = require('../../parser/index');
const Handler = require('./handler');

class Server extends EventHandler {
    constructor() {
        super();
        fs.readFile('config.json', (err, data) => {
            if (err) {
                throw err;
            }
            this.config = JSON.parse(data);
            console.log(this.config);
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
                console.log(JSON.stringify(buffer));
                /* Phrase the message to be either stored or sent */
                Parser.parse(buffer, this.config, response => {
                    switch (response) {
                        case 250:
                            client.write('250 OK\r\n');
                            break;
                        case 554:
                            client.write('554 Transaction failed');
                            break;
                        case 451:
                        default:
                            client.wrire('451 Local error in processing');
                            break;
                    }
                });
            });
        });

        server.on('error', err => {
            throw err;
        });

        server.listen(this.config.port, () => {
            console.log('Server bound to port: ' + this.config.port);
            this.emit('ready');
        });
    }
}

module.exports = Server;

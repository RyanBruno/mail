// Const phraser = require('../../phraser/index');

const net = require('net');
const Handler = require('./handler');

const FQDN = 'smtp.rbruno.com';

class Server {
    constructor(port = 25) {
        this.port = port;
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
            client.write('220 ' + FQDN + ' Service ready\r\n');

            /* Handles the client */
            Handler.handle(client, buffer => {
                console.log(JSON.stringify(buffer));
                /* Phrase the message to be either stored or sent */
                // phraser.phrase(mail);
                // send response
            });
        });

        server.on('error', err => {
            throw err;
        });

        server.listen(this.port, () => {
            console.log('Server bound');
        });
    }
}

module.exports = Server;

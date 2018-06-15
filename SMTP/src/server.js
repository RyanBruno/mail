//const phraser = require('../../phraser/index');

const net = require('net');
const handler = require('./handler');
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
            client.on('end', () => {
                console.log('client disconnected');
            });
            console.log(typeof client);
            /* Set Encoding */
            client.setEncoding('ascii');

            /* Send service ready response */
            //client.write(lib.createReply(220, FQDN + ' Service ready'));

            /* Handles the client */
            const mail = handler.handle(client);
            /* Phrase the message to be either stored or sent */
            //phraser.phrase(mail);
        });

        server.on('error', err => {
            throw err;
        });

        server.listen(this.port, () => {
            console.log('server bound');
        });
    }
}

module.exports = Server;

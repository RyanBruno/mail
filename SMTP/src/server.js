//const phraser = require('../../phraser/index');

const net = require('net');
const handler = require('./handler');

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

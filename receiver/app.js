const net = require('net');
const Server = require('./index');

const server = new Server(25565);

/* Testing */

server.on('ready', () => {
    const client = new net.Socket();
    const commands = ['QUIT', 'TEST\r\n.\r\n', 'DATA', 'RCPT TO:<test@gmail.com>',
        'MAIL FROM:<ryan@rbruno.com>', 'EHLO smtp.rbruno.com'];

    client.connect(25565, '127.0.0.1', () => {
        console.log('c: Connected');
    });

    client.on('data', data => {
        console.log('s: ' + data);
        data = data.toString();
        if (!(data.startsWith('2') || data.startsWith('3'))) {
            return;
        }
        const command = commands.pop();
        if (command) {
            console.log('c: ' + command);
            client.write(command + '\r\n');
        }
    });

    client.on('close', () => {
        console.log('Connection closed');
    });
});

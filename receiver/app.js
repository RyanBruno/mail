const Server = require('./index');

const sever = new Server(25565);

/* Testing */

var net = require('net');

var client = new net.Socket();
let commands = ['TEST\r\n.\r\n', 'DATA', 'RCPT TO:<test@gmail.com>', 
                'MAIL FROM:'/*<ryan@rbruno.com>'*/, 'EHLO smtp.rbruno.com']

client.connect(25565, '127.0.0.1', function() {
	console.log('c: Connected');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
    data = data.toString();
    if (!(data.startsWith('2') || data.startsWith('3'))) {
        return;
    }
    let command = commands.pop();
    console.log('c: ' + command);
    client.write(command + '\r\n');
});

client.on('close', function() {
	console.log('Connection closed');
});

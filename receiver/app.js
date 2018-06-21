const net = require('net');
const Server = require('./index');
const nodemailer = require('nodemailer');

const server = new Server();

/* Testing */

server.on('ready', () => {
    /*const client = new net.Socket();
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
    });*/
    for(let i = 0; i < 1; i++) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 25565,
        secure: false, // true for 465, false for other ports
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@bananas.com', // list of receivers
        subject: 'Hello ' + i, // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    });
    }
}); 

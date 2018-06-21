const nodemailer = require('nodemailer');
const Server = require('./index');

const server = new Server();

/* Testing */

server.on('ready', () => {
    for (let i = 0; i < 1; i++) {
        // Create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 25565,
            secure: false // True for 465, false for other ports
        });

        // Setup email data with unicode symbols
        const mailOptions = {
            from: '"Fred Foo 👻" <foo@example.com>', // Sender address
            to: 'bar@example.com, baz@bananas.com', // List of receivers
            subject: 'Hello ' + i, // Subject line
            text: 'Hello world?', // Plain text body
            html: '<b>Hello world?</b>' // Html body
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }
});

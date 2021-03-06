const net = require('net');
const dns = require('dns');
const Logger = require('./logger');

module.exports.send = mail => {
    dns.resolveMx(mail.domain, (err, addresses) => {
        if (err) {
            returnToSender(mail, 'Failed to resolve ' + mail.domain);
            Logger.warn('Failed to resolve ' + mail.domain + ' for mail ' + mail.messageID);
            return;
        }
        const fqdn = addresses[0].exchange;

        const client = new net.Socket();
        const commands = ['DATA', 'MAIL FROM:<' + mail.from.local + '@' + mail.from.domain + '>', 'EHLO ' + fqdn];

        client.connect(25, fqdn);

        client.on('data', data => {
            data = data.toString();
            if (!(data.startsWith('2') || data.startsWith('3'))) {
                returnToSender(mail, 'Failed to forward mail to ' + mail.domain);
                client.write('QUIT\r\n');
                return;
            }
            const command = commands.pop();
            if (command) {
                if ((command.startsWith('MAIL FROM') || command.startsWith('RCPT TO')) && mail.to.length > 0) {
                    const recipient = mail.to.pop();
                    commands.push('RCPT TO:<' + recipient.local + '@' + recipient.domain + '>');
                }

                client.write(command + '\r\n');

                if (command === 'DATA') {
                    mail.mail.forEach(line => {
                        client.write(line + '\r\n');
                    });
                    client.write('.\r\n');
                }
            } else {
                Logger.info(Date.now() + ' Mail (' + mail.messageID + ') forwarded to ' + fqdn);
            }
        });

        client.on('close', () => {
            // TODO
            Logger.debug('Connection closed');
        });
    });
};

function returnToSender() {
    // TODO
}

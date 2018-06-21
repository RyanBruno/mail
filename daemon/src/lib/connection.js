const EventEmitter = require('events');
const Session = require('./session');

class Connection extends EventEmitter {
    constructor(options = {}) {
        super();
        this.maxCommand = options.maxCommand || 512;
        this.maxText = options.maxText || 1000;
        this.maxMessage = options.maxMessage || 64000;
        this.maxRecipients = options.maxRecipients || 100;
    }

    data(data) {
        if (this.mailData) {
            if (data.trim() === '.') {
                // Check maxMessage
                // TODO fix
                if (this.mailData.length >= this.maxMessage) {
                    this.emit('reply', '552 Too much mail data');
                    return;
                }
                this.session.endMail(this.mailData);
            } else {
                if (data.length >= this.maxText) {
                    this.emit('reply', '500 Line too long');
                    return;
                }
                this.mailData.push(data);
            }
            return;
        }

        if (data.length >= this.maxCommand) {
            this.emit('reply', '500 Line too long');
            return;
        }

        const command = this.getCommand(data);
        if (!command) {
            this.emit('reply', '500 Command not unrecognized');
            return;
        }

        if (command === 'EHLO' || command === 'HELO') {
            if (command.length === data.trim().length) {
                this.emit('reply', '504 Command parameter not implemented');
            } else {
                this.session = new Session({maxRecipients: this.maxRecipients});

                this.session.on('reply', reply => {
                    this.emit('reply', reply);
                });
                this.session.on('data', () => {
                    this.mailData = [];
                });
                this.session.on('mail', buffer => {
                    buffer.timestamp = Date.now();
                    this.emit('mail', buffer);
                    this.mailData = null;
                });
                this.emit('reply', '250 OK');
            }
        } else if (command === 'RSET') {
            this.session = null;
            this.emit('reply', '250 OK');
        } else if (command === 'NOOP') {
            this.emit('reply', '250 OK');
        } else if (command === 'QUIT') {
            this.emit('quit');
        } else if (command === 'VRFY') {
            // TODO Verify
        } else if (this.session) {
            this.session.command(command, data);
        } else {
            this.emit('reply', '503 Bad sequence of commands');
        }
    }

    getCommand(data) {
        data = data.trim().split(' ')[0].toUpperCase();
        const commands = ['EHLO', 'HELO', 'MAIL', 'RCPT', 'DATA', 'RSET', 'NOOP', 'QUIT', 'VRFY'];
        if (!commands.includes(data)) {
            return null;
        }
        return data;
    }
}

module.exports = Connection;

const Session = require('./session');
const EventEmitter = require('events');

class Connection extends EventEmitter{
    data(data) {
        if (!(this.mailData == null)) {
            if (data.trim() == '.') {
                this.session.endMail(this.mailData);
            } else {
                this.mailData.push(data);
            }
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
                this.session = new Session();

                this.session.on('reply', reply => {
                    this.emit('reply', reply);
                });
                this.session.on('data', () => {
                    this.mailData = [];
                });
                this.session.on('mail', buffer => {
                    // Validate the mail and sends it
                    // Send OK
                    this.emit('mail', buffer);
                    this.mailData = null;
                });
                this.emit('reply', '250 OK');
                return;
            }
        } else if (command === 'RSET') {
            this.session = null;
            this.emit('reply', '250 OK');
        } else if (command === 'NOOP') {
            this.emit('reply', '250 OK');
        } else if (command === 'QUIT') {
            // QUIT
        } else if (command === 'VRFY') {
            // Verify
        }

        if (this.session) {
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

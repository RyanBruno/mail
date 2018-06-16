const EventEmitter = require('events');

class Session extends EventEmitter {
    command(command, data) {
        if (command === 'MAIL') {
            this.mail(data);
        } else if (command === 'RCPT') {
            this.recipient(data);
        } else if (command === 'DATA') {
            this.data(data);
        } else {
            this.emit('reply', '500 Command not unrecognized');
        }
    }

    mail(data) {
        if (data.toUpperCase().startsWith('MAIL FROM:')) {
            // Check if mailbox exitst
            // Check if reverse-path
            const sender = data.substring(10);

            if (this.buffer) {
                this.emit('reply', '503 Bad sequence of commands');
            } else {
                this.buffer = {reversePath: sender, forwardPath: [], mailData: null};
                this.emit('reply', '250 OK');
            }
        } else {
            this.emit('reply', '504 Command parameter not implemented');
        }
    }

    recipient(data) {
        if (data.toUpperCase().startsWith('RCPT TO:')) {
            // Validate recipient
            const recipient = data.substring(8);

            if (this.buffer) {
                this.buffer.forwardPath.push(recipient);
                this.emit('reply', '250 OK');
            } else {
                this.emit('reply', '503 Bad sequence of commands');
            }
        } else {
            this.emit('reply', '504 Command parameter not implemented');
        }
    }

    data(data) {
        if (this.buffer && this.buffer.forwardPath.length > 0) {
            this.emit('data');
            this.emit('reply', '354 Start mail input; end with <CRLF>.<CRLF>');
        } else {
            this.emit('reply', '503 Bad sequence of commands');
        }
    }

    endMail(data) {
        if (this.buffer) {
            this.buffer.mailData = data;
            this.emit('mail', this.buffer);
            this.buffer = null;
        } else {
            throw new Error('Tried to set mail-data but buffer was not found');
        }
    }
}

module.exports = Session;

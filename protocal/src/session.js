const EventEmitter = require('events');

class Session extends EventEmitter {

    command(command, data) {
        if (command === 'MAIL') {
            session.mail(data);
        } else if(command === 'RCPT') {
            session.recipient(data);
        } else if(command === 'DATA') {
            session.data(data);
        } else {
            this.emit('reply', '500 Command not unrecognized');
        }
    }

    mail(data) {
        if (!input.toUpperCase().startsWith('MAIL FROM:')) {
            // Invalid args
        } else {
            // Check if mailbox exitst
            // Check if reverse-path
            // return OK
            let sender = input.substring(10);
            // Check if buffer
            this.buffer = { reverse-path: sender, forward-path: [], mail-data: null};
        }
    }

    recipient(data) {
        if (!input.toUpperCase().startsWith('RCPT TO:')) {
            // Invalid args
        } else {
            // Validate recipient??
            // return Ok
            let recipient = input.substring(8);
            // Check if buffer
            buffer.forward-path.push(recipient);
        }
    }

    data(data) {
        if (!(input.length === command.length)) {
            // invalid args                
        } else {
            // Check if buffer
            this.emit('data');
        }
    }

    setData(data) {
        if (!buffer) {
            // Throw error
        } else {
            buffer.mail-data = data;
        }
    }
}

module.exports = Session;

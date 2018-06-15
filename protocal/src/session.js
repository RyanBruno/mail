const EventEmitter = require('events');

class Session extends EventEmitter {
    constructor(options) {
        this.FQDN = options.FQDN;
        // Send 250 OK
    }

    /*
     * Reads the raw command and emits events.
     */
    command(input) {
        input = input.trim();
        command = input.split(' ')[0].toUpperCase();
        
        if (command === 'MAIL') {
            if (!input.toUpperCase().startsWith('MAIL FROM:')) {
                // Invalid args
            } else {
                // Check if mail
                // Check if reverse-path
                this.mail = new Mail(input.subString(10));
                // return OK
            }
        } else if(command === 'RCPT') {
            if (!mail) {
                //return error
            }
            if (!input.toUpperCase().startsWith('RCPT TO:')) {
                // Invalid args
            } else {
                mail.addRecipient(input.subString(8));
                // return Ok
            }
        } else if(command === 'DATA') {
            if (!(input.length === command.length)) {
                // invalid args                
            } else {
                this.emit('data');
            }
        }
    }
}

module.exports = Session;

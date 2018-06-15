const lib = require('./../../protocal/index');


module.exports.handle = client => {
    let connection = lib.connection();
    let mailData = null;

    client.on('data', function(data) {
        let command = lib.command(data);

        if (mailData) {
            if (data === '.') {
                session.setData(mailData);
            } else {
                mailData.push(data) 
            }
        }

        if (command === 'EHLO' || command === 'HELO') {
            if (command.length() === data.trim().length()) {send
                client.send('504 Command parameter not implemented');
            } else {
                session = new lib.session();

                session.on('reply', reply => {
                    client.send(reply);
                    // Reply 
                });
                session.on('data', () => {
                    mailData = [];
                });
               return;
            }
        } else if (command === 'RSET') {
            session = null;
            client.send('250 OK');
        } else if (command === 'NOOP') {
            client.send('250 OK');
        } else if (command === 'QUIT') {
            // QUIT
        } else if (command === 'VRFY') {
            // Verify
        }

        if (session) {
            session.command(command, data);
        } else {
            // Error
            client.send('500 Command not unrecognized');
        }
    }); 
};

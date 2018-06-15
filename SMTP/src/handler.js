const lib = require('./../../protocal/index');

const FQDN = 'smtp.rbruno.com';

module.exports.handle = client => {
    /* Set Encoding */
    client.setEncoding('ascii');
    /* Send service ready response */
    client.write(lib.createReply(220, FQDN + ' Service ready'));

    let session;
    let data = false;

    client.on('data', function(data) {
        let command = lib.command(data);
        
        if (data) {
            if (data === '.') {
                
            } else {
            }
        }

        if (command === 'EHLO') {
            if (command.length() === data.trim().length()) {
                // Send a error
            } else {
                session = new lib.session({});
                session.on('data', () => {
                    data = true;
                    // Read data
                });
                session.on('reply', (reply) => {
                    // Reply 
                });
                return;
            }
        }

        if (session) {
            session.command(data);
        } else {
            
        }
    }); 
};

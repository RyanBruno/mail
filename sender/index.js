const SMTPConnection = require('nodemailer/lib/smtp-connection');

module.exports.send = mail => {
    console.log('Sent: ' + JSON.stringify(mail));
    // TODO send and log
};

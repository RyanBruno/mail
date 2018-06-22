/*
 * /var/mail
 *       /<user>
 *          /Message-ID.email
 */
const fs = require('fs');

module.exports.store = (mail, config) => {
    const mailDir = config.mailDir.endsWith('/') ? config.mailDir : config.mailDir + '/';
    mail.to.forEach(address => {
        const file = mailDir + address.local + '/' + mail.messageID + '.email';
        fs.access(file, fs.constants.F_OK, err => {
            if (err) {
                fs.writeFile(file, JSON.stringify(mail), err => {
                    if (err) {
                        console.error(Date.now() + ' ' + err);
                    }
                    console.log(Date.now() + ' Stored (' + mail.messageID + ') in file ' + file);
                });
            } else {
                console.error(Date.now() + ' Mail (' + mail.messageID + ') already exists');
            }
        });
    });
};

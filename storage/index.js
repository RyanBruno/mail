/*
 * /var/mail
 *       /<user>
 *          /Message-ID.email
 */
const fs = require('fs');

module.exports.store = (mail, config) => {
    console.log('Stored: ' + JSON.stringify(mail));
    for (mail.to.forEach(address => {
        const file = '/var/mail/' +  + '/' + mail.messageID + '.email';
        if (fs.existsSync(file)) {
            fs.writeFile(file, JSON.stringify(mail), (err) => {
                if (err) {
                    console.err(Date.now() + ' ' + err);
                }
                console.log(Date.now() + ' Stored (' + mail.messageID + ') in file ' + file);
            };
        } else {
            console.err(Date.now() + ' Mail (' + mail.messageID + ') already exists');
        }
    };

};

const fs = require('fs');
const Logger = require('logger').logger;

module.exports.store = (mail, config) => {
    const mailDir = config.mailDir.endsWith('/') ? config.mailDir : config.mailDir + '/';
    mail.to.forEach(address => {
        if (config.mailbox.includes(address.local)) {
            fs.mkdir(mailDir + address.local, () => {
                save(mail, mailDir + address.local);
            });
        } else {
            fs.mkdir(mailDir + 'nobody', () => {
                save(mail, mailDir + 'nobody');
            });
        }
    });
};

function save(mail, mailDir) {
    const file = mailDir + '/' + Date.now() + '.email';
    fs.access(file, fs.constants.F_OK, err => {
        if (err) {
            fs.writeFile(file, JSON.stringify(mail), err => {
                if (err) {
                    console.error(Date.now() + ' ' + err);
                }
                Logger.info('Stored (' + mail.messageID + ') in file ' + file);
            });
        } else {
            console.error(Date.now() + ' Mail (' + mail.messageID + ') already exists');
        }
    });
}

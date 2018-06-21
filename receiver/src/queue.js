const dns = require('dns');

const mailQueue = [];

module.exports = config => {
    /* Create socket and interface with sender */
};

module.exports.queue = (mail, config) => {
    const hosts = [];
    mail.to.forEach(to => {
        if (!hosts.includes(to.domain) && !(to.domain === config.FQDN)) {
            hosts.push(to.domain);
        }
    });

    hosts.forEach(domain => {
        const splitMail = Object.assign({domain: domain}, mail);
        mailQueue.push(splitMail);
        splitMail.to = splitMail.to.filter(recipient => {
            if (recipient.domain === domain) {
                return true;
            }
            return false;
        });
        console.log(Date.now() + ' Adding mail ' + mail.messageID + ' to mail queue.');
    });
};



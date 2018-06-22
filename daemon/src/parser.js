const Sender = require('./sender');
const Storage = require('./storage');

module.exports.parse = (buffer, config, callback) => {
    /* Parse and validate mail headers */
    const mail = format(buffer);

    /* Respond to the client */
    const response = validate(mail);
    callback(response);
    if (response !== 250) {
        console.error(Date.now() + ' Invalid email (' + mail.messageID + ') was rejected with code ' + response);
        return;
    }

    console.log(Date.now() + ' Email (' + mail.messageID + ') accepted with code ' + response);

    /* Filter out local mail */
    const save = Object.assign({}, mail);
    save.to = save.to.filter(recipient => {
        if (config.domain.includes(recipient.domain)) {
            return true;
        }
        return false;
    });

    /* If there is any local mail send to spam filter */
    if (save.to.length > 0) {
        if (config.spamFilter) {
            config.spamFilter(save, config);
        } else {
            Storage.store(save, config);
        }
    }

    /* Get a list of all to hosts */
    const hosts = [];
    mail.to.forEach(to => {
        if (!hosts.includes(to.domain) && !(to.domain === config.FQDN)) {
            hosts.push(to.domain);
        }
    });

    /* Break up to mail into diffrent hosts */
    hosts.forEach(host => {
        const newMail = Object.assign({domain: host}, mail);
        newMail.to = mail.to.filter(recipient => {
            if (recipient.domain === host) {
                return true;
            }
            return false;
        });

        Sender.send(newMail, config);
    });
};

function format(buffer) {
    const mail = {};

    /* Formath the reverse-path address */
    if (buffer.reversePath.indexOf('<') === -1) {
        buffer.reversePath = '<' + buffer.reversePath;
    }
    if (buffer.reversePath.indexOf('>') === -1) {
        buffer.reversePath += '>';
    }
    let from = buffer.reversePath.split('<')[1].split('>')[0];
    if (from.indexOf(':') >= 0) {
        from = from.split(':')[1];
    }
    if (from.indexOf('@') === -1) {
        from += '@';
    }
    from = from.split('@');
    mail.from = {local: from[0], domain: from[1]};

    /* Format the forward-path addresses */
    mail.to = [];
    buffer.forwardPath.forEach(to => {
        if (to.indexOf('<') === -1) {
            to = '<' + to;
        }
        if (to.indexOf('>') === -1) {
            to += '>';
        }
        to = to.split('<')[1].split('>')[0];
        if (to.indexOf(':') >= 0) {
            to = to.split(':')[1];
        }
        if (to.indexOf('@') === -1) {
            to += '@';
        }
        to = to.split('@');
        mail.to.push({local: to[0], domain: to[1]});
    });
    mail.mail = buffer.mailData;
    mail.timestamp = buffer.timestamp;

    /* Find and format the message-id */
    for (let i = 0; i < mail.mail.length; i++) {
        if (mail.mail[i].toUpperCase().startsWith('MESSAGE-ID:')) {
            mail.messageID = mail.mail[i].substring(11).trim();
            break;
        }
    }

    if (!mail.messageID) {
        // TODO Make a messageID
    }

    return mail;
}

function validate(mail) {
    if (mail.from.local.length <= 0 && mail.from.domain.length <= 0) {
        return 451;
    }
    if (mail.to.length <= 0) {
        return 451;
    }
    mail.to.forEach(recipient => {
        if (recipient.local.length <= 0 && recipient.domain.length <= 0) {
            return 554;
        }
    });
    return 250;
}
/* {
 *  from: {local: 'ryan', domain: 'rbruno.com'},
 *  to:[{local: 'test', domain: 'gmail.com'}],
 *  mail: [line, line],
 *  timestamp: 3245461324634
 * }
 */

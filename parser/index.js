const spamFilter = require('../spam-filter/index');
const Sender = require('../sender/index');

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

    console.log(Date.now() + ' Email (' + mail.messageID + ') accepted with code ');
    const save = Object.assign({}, mail);
    const send = Object.assign({}, mail);
    save.to = [];
    send.to = [];
    let address;
    while (mail.to.length > 0) {
        address = mail.to.pop();
        if (config.domain.includes(address.domain)) {
            save.to.push(address);
        } else {
            send.to.push(address);
        }
    }

    if (save.to.length > 0) {
        spamFilter(save);
    }
    if (send.to.length > 0) {
        Sender.send(send);
    }
};

function format(buffer) {
    const mail = {};

    /* Formath the reverse-path address */
    let from = buffer.reversePath.replace('<', '').replace('>', '');
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
        to = to.replace('<', '').replace('>', '');
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
        if (mail.mail[i].toUppercase().startsWith('MESSAGE-ID')) {
            mail.messageID = mail.mail[i].substring(10).trim();
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

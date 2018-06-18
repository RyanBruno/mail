const spamFilter = require('../spam-filter/index');
const Queue = require('../queue/index');

module.exports.parse = (buffer, config, callback) => {
    /* Parse and validate mail headers */
    const mail = format(buffer);

    /* Respond to the client */
    const response = validate(mail);
    callback(response);
    console.log(mail);
    if (response !== 250) {
        return;
    }

    const save = mail;
    const send = mail;
    save.to = [];
    send.to = [];
    let address;
    while ((address = mail.to.pop())) {
        if (config.domain.includes(address.domain)) {
            save.to.push(address);
        } else {
            send.to.push(address);
        }
    }

    if (save.to.length > 0) {
        spamFilter(mail);
    }
    if (send.to.length > 0) {
        Queue.queue(mail);
    }
};

function format(buffer) {
    const mail = {};
    let from = buffer.reversePath.replace('<', '').replace('>', '');
    if (from.indexOf(':') >= 0) {
        from = from.split(':')[1];
    }
    if (from.indexOf('@') === -1) {
        from += '@';
    }
    from = from.split('@');
    mail.from = {local: from[0], domain: from[1]};

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

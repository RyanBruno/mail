
/* {"reversePath":"<ryan@rbruno.com>","forwardPath":["<test@gmail.com>"],"mailData":["TEST"]} */
module.exports.parse = (buffer, config, callback) => {
    /* Parse and validate mail headers */
    const mail = format(buffer);
    // Parse buffer into mail object
    callback(250);

    mail.to.forEach(address => {
        if (config.domain.conatins(address.domain)) {
            // To Spam filter
        } else {
            // To Securty => Mail queue
        }
    });
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
    mail.mail = buffer.messageData;
    mail.timestamp = buffer.timestamp;
    return mail;
}
/* {
 *  from: {local: 'ryan', domain: 'rbruno.com'},
 *  to:[{local: 'test', domain: 'gmail.com'}],
 *  mail: {TODO},
 *  timestamp: 3245461324634
 * }
 */

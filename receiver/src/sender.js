const net = require('net');

module.exports.send = (mail, config) => {
    console.log(Date.now() + ' Sending mail ' + mail.messageID + ' to ' + mail.domain);
};

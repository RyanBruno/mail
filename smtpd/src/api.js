const http = require('http');
const Logger = require('./logger');

module.exports.sendToQueue = mail => {
    const postData = JSON.stringify(mail);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/mail',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, res => {
        if (res.statusCode === 200){
            Logger.info('Sent mail (' + mail.messageID + ') successfully send to queue');
        } else {
            // TODO
            Logger.error('An error occured sending mail (' + mail.messageID + ') to queue. Code: ' + res.statusCode);
        }
    });

    req.on('error', err => {
        Logger.error('An error occured sending mail (' + mail.messageID + ') to queue. Error:' + err);
    });
    /* Send post data */
    req.write(postData);
    req.end();
};

module.exports.sendToStore = mail => {
};

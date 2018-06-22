const spamFilter = require('../spam-filter/index');
const Server = require('./src/server');

module.exports = new Server({
    port: 25565,
    FQDN: 'smtp.rbruno.com',
    domain: ['rbruno.com'],
    mailbox: ['ryan'],
    mailDir: '/tmp/mail',
    maxCommand: 512,
    maxText: 1000,
    maxMessage: 64000,
    maxRecipients: 100,
    spamFilter
});

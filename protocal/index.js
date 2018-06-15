const Session = require('src/session');
const mail = require('src/mail');

module.exports.Session = session;
module.exports.Mail = mail;

module.exports.command = command => {
    command = command.trim();
    command = command.split(' ')[0].toUpperCase();
    return command;
};


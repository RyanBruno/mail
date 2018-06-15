const Session = require('src/session');
const mail = require('src/mail');

module.exports.Session = session;

module.exports.command = data => {
    data = data.trim();
    data = data.split(' ')[0].toUpperCase();
    return data;
};

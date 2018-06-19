const Storage = require('../storage/index');

module.exports = (mail, config) => {
    // TODO Spam filter
    mail.spam = false;
    Storage.store(mail, config);
    // Send to mail storage
};

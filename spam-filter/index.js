const Storage = require('../reciver/storage');

module.exports = (mail, config) => {
    // TODO Spam filter
    mail.spam = false;
    // Console.log(Date.now() + ' Marked mail (' + mail.messageID + ') as spam');
    Storage.store(mail, config);
    // Send to mail storage
};

const {MongoClient} = require('mongodb');
const Logger = require('./logger').logger;

let db = null;

module.exports.store = (mail, config) => {
    if (db) {
        storeMail(mail);
    } else {
        /* Connect to db */
        MongoClient.connect(config.database.url, {useNewUrlParser: true}, (err, client) => {
            if (err) {
                throw err;
            }
            (Date.now() + ' Connected database');

            db = client;

            db.on('error', err => {
                throw err;
            });
            db.on('close', err => {
                throw err;
            });
            storeMail(mail);
        });
    }
};

function storeMail(mail) {
    /* Check for collection */
    /* Insert */
}


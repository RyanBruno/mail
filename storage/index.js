/*
 * /var/mail
 *       /<user>
 *          /<user>-0001.email
 *          /<user>-0002.email
 */

module.exports.store = (mail, config) => {
    console.log('Stored: ' + JSON.stringify(mail));
};

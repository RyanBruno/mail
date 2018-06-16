const lib = require('./../../protocal/index');

module.exports.handle = (client, callback) => {
    const connection = new lib.connection();

    connection.on('reply', data => {
        client.write(data + '\r\n');
        // TODO log
    });

    connection.on('mail', buffer => {
        // Check mail then emit
        callback(buffer);
    });

    client.on('data', data => {
        connection.data(data);
    });
};

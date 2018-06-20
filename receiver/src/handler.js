const lib = require('./../../protocal/index');

module.exports.handle = (client, config, callback) => {
    const connection = new lib.Connection(config);

    connection.on('reply', data => {
        client.write(data + '\r\n');
    });

    connection.on('mail', buffer => {
        /* Check mail then emit */
        callback(buffer);
    });

    connection.on('quit', () => {
        client.end('221 ' + config.FQDN + ' Service closing transmission channel');
    });

    client.on('data', data => {
        /* Splits data and send them to the lib */
        data = data.trim().split('\r\n');
        data.forEach(line => {
            connection.data(line);
        });
    });

    client.on('end', () => {
        // TODO End
    });
};

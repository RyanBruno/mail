const express = require('express');
const {MongoClient} = require('mongodb');

const app = express();

/* Connect to db */
MongoClient.connect('mongodb://' + process.env.DATABASE + ':27017/queue', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        throw err;
    }

    client.on('error', err => {
        throw err;
    });
    client.on('close', err => {
        throw err;
    });

    app.use(express.json());

    app.post('/mail', (req, res) => {
        console.log(req.body);
        /* Check if sender is ready */
        /* Store in queue db */
        res.status(200).end();
    });

    app.listen(3000, () => console.log('Example app listening on port 3000!'));
});

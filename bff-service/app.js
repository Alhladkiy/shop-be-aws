const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.all('/*', (req, res) => {
    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);
    
    const recipient = req.originalUrl.split('/')[1];
    console.log('recipient', recipient);

    const recipientURL = process.env[recipient];
    console.log('recipientURL', recipientURL);


    if(recipientURL) {
        const axiosConfig = {
            method: req.method,
            url: `${recipientURL}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body}),

        };
        console.log('axiosConfig', axiosConfig);

        axios(axiosConfig)
        .then(function(response) {
            console.log('response from recipient', response.data);
            res.json(response.data);
        })
        .catch((err) => {
            console.log('some err: ', JSON.stringify(err));

            if (err.response) {
                const {
                    status,
                    data
                } = err.response;

                res.status(status).json(data);
            } else {
                res.status(500).json({err: err.message});
            }
        })
    } else {
        res.status(502).json({err: 'Cannot process request'});
    }
});

app.listen(PORT, (err) => {
    console.log(`BFF APP started on port ${PORT}`)
})
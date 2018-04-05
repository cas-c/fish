const fetch = require('node-fetch');
const btoa = require('btoa');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

const config = require('../../config');
const { catchAsync } = require('../utils');
const CLIENT_ID = config.client.id;
const CLIENT_SECRET = config.client.secret;

const redirect = encodeURIComponent('http://localhost:3000/api/discord/callback');

router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            }
        }
    );
    const json = await response.json();
    console.log(json);
    const discordInfo = await fetch(`https://discordapp.com/api/users/@me`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${json.access_token}`
            }
        }
    );
    const discordJson = await discordInfo.json();
    console.log(discordJson);

    User.findOne({
        id: discordJson.id
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            const newUser = new User({
                name: discordJson.username,
                id: discordJson.id,
                token: json.access_token,
                admin: false,
                discord: discordJson,
                auth: json,
                lastUpdated: Date.now()
            });
            newUser.save(err => {
                if (err) throw err;
                console.log('User saved successfully');
            });
        };
        user.set({
            token: json.access_token,
            discord: discordJson,
            auth: json,
            lastUpdated: Date.now()
        })
        user.save(err => {
            if (err) throw err;
            console.log('User updated successfully');
        })
        const payload = {
            access_token: json.access_token
        };
        const token = jwt.sign(payload, config.secret);
        res.redirect(`/?token=${token}`);
    })
}))

module.exports = router;

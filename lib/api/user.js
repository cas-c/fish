const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

const config = require('../../config');
const { catchAsync } = require('../utils');

router.get('/timezone', catchAsync(async (req, res) => {
    const token = req.headers.authorization.match(/Bearer\s((.*)\.(.*)\.(.*))/)[1];
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.json({ success: false, message: 'failed to authenticate token' });
        }
        req.decoded = decoded;
        const user = await User.findOne({
            id: decoded.discord_id
        });
        if (user) {
            res.json({
                timezone: user.timezone || ''
            });
        }
    })
}));

router.post('/timezone', catchAsync(async (req, res) => {
    const token = req.headers.authorization.match(/Bearer\s((.*)\.(.*)\.(.*))/)[1];
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.json({ success: false, message: 'failed to authenticate token' });
        }
        req.decoded = decoded;
        const user = await User.findOne({
            id: decoded.discord_id
        });
        if (user) {
            user.set({ timezone: `${req.body.timezone}` });
            user.save(err => {
                if (err) throw err;
                console.log('User timezone updated.');
                res.json({ success: true, timezone: user.timezone });
            })
        }
    })
}));

module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

const config = require('../../config');
const { catchAsync, getBearerToken } = require('../utils');

router.get('/all', catchAsync(async(req, res) => {
    const token = getBearerToken(req.headers.authorization);
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.json({ success: false, message: 'failed to authenticate token' });
        }
        req.decoded = decoded;
        const users = await User.find({});
        res.json(users.map(u => {
            const { mfa_enabled, ...cleanedDiscord } = u.discord;
            return {
                timezone: u.timezone,
                discord: cleanedDiscord
            }
        }));
    });
}));

router.delete('/:id', catchAsync(async(req, res) => {
    const token = getBearerToken(req.headers.authorization);
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.json({ success: false, message: 'failed to authenticate token' });
        } else if (decoded.discord_id !== config.trueAdmin) {
            return res.json({ success: false, message: 'not authorized'});
        }
        await User.findByIdAndRemove(req.params.id);
        res.json({ success: true, message: 'deleted user' });
    });
}));


router.get('/timezone', catchAsync(async (req, res) => {
    const token = getBearerToken(req.headers.authorization);
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
    const token = getBearerToken(req.headers.authorization);
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

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../config');
const User = require('../models/user');

router.post('/authenticate', (req, res) => {
    User.findOne({
        name: req.body.name
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Not authorized due to unable to find user' });
        } else if (user) {
            if (user.password !== req.body.password) {
                res.json({ success: false, message: 'Auth failed. Wrong password' });
            } else {
                const payload = {
                    admin: user.admin
                };

                const token = jwt.sign(payload, config.secret);

                res.json({
                    success: true,
                    message: 'heres your token',
                    token
                });
            }
        }
    })
});

router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: 'failed to authenticate token' });
            }
            req.decoded = decoded;
            return next();
        })
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token found'
        });
    }
})

router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    })
})

module.exports = router;

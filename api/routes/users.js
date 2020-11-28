const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email}).exec()
    .then(user => {
        if(user.length >= 1) {
            res.status(422).json({
                message: 'User already exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({ err });
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
        
                    user.save()
                    .then(u => {
                        res.status(201).json({
                            message: 'User created',
                            user: {
                                email: u.email,
                                _id: u._id
                            }
                        })
                    }).catch(error => {
                        res.status(500).json({
                            error
                        })
                    })
                }
        
            })
        }
    }).catch()
    

})

router.delete('/:userId', (req, res, next) => {
    const _id = req.params.userId;
    User.remove({
        _id
    }).exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted",
                data: {}
            });
        }).catch(err => {
            res.status(500).json({
                err
            });

        });
})

module.exports = router
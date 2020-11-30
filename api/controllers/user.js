const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.SignUp = (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(422).json({
                    message: 'User already exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
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


}

exports.Login = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "Login failed" });
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: "Login failed" });
                }

                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    }, process.env.JWT_KEY,
                        { expiresIn: '1h' }
                    );
                    return res.status(200).json({
                        message: 'Login successful',
                        token
                    })
                }
                return res.status(401).json({ message: "Login failed" });

            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                err
            });
        })
}

exports.DeleteUser = (req, res, next) => {
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
}
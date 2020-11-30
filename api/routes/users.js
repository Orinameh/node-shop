const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middlewate/check-auth');

router.post('/signup', UserController.SignUp);

router.post('/login', UserController.Login);

router.delete('/:userId', checkAuth, UserController.DeleteUser)

module.exports = router
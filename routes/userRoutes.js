const express = require('express');
const {logInLimiter} = require('../middleware/rateLimiter');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middleware/auth');
const {validateSignUp,validateLogin,validateResult } = require('../middleware/validate');

const router = express.Router();

router.get('/new', isGuest, controller.new);

router.post('/', isGuest,validateSignUp, validateResult, controller.create);

router.get('/login', isGuest, controller.getLogin);

router.post('/login',logInLimiter, isGuest, validateLogin, validateResult, controller.login);

router.get('/profile', isLoggedIn, controller.profile);

router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;

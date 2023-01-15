const router = require('express').Router;
const authController = require('../controller/auth');


let route = router();

route.post('/register', authController.register);
route.post('/login', authController.login)

module.exports = route
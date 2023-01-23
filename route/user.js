const router = require('express').Router;
const userController = require('../controller/user');
const { isAuthenticated } = require('../middleware/isAuthenticated');

let route = router();

route.post('/changePassword', isAuthenticated, userController.changePassword);
route.get('/getProfile', isAuthenticated, userController.getProfile);
route.post('/changeProfile', isAuthenticated, userController.changeProfile);
route.get('/deleteUser', isAuthenticated, userController.deleteUser)


module.exports = route
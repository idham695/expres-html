const router = require('express').Router;
const listController = require('../controller/list');
const { isAuthenticated } = require('../middleware/isAuthenticated');

let route = router();
route.get('/', isAuthenticated, listController.getAllList);
route.get('/:id', isAuthenticated, listController.getList);
route.post('/create', isAuthenticated, listController.createList);
route.post('/:id/update', isAuthenticated, listController.updateList);
route.get('/:id/delete', isAuthenticated, listController.deleteList);


module.exports = route;
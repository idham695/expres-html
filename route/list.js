const router = require('express').Router;
const listController = require('../controller/list');


let route = router();
route.get('/', listController.getAllList);
route.get('/:id', listController.getList);
route.post('/create', listController.createList);
route.post('/:id/update', listController.updateList);
route.get('/:id/delete', listController.deleteList);


module.exports = route;
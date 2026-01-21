const { Router } = require('express');

const spotController = require('../controllers/spottings');
const spotRouter = Router();

spotRouter.get('/', spotController.index);
spotRouter.get('/id/:id', spotController.show);
spotRouter.get('/filter/user/:id', spotController.filterByUser);
spotRouter.get('/filter/type/:type', spotController.filterByType);
spotRouter.post('/new', spotController.create);

module.exports = spotRouter;
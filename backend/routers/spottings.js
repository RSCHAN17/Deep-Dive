const { Router } = require('express');

const spotController = require('../controllers/spottings');
const spotRouter = Router();

spotRouter.get('/', spotController.index);
spotRouter.get('/id/:id', spotController.show);
spotRouter.post('/new', spotController.create);
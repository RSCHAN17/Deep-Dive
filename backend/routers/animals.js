const { Router } = require('express');

const animalController = require('../controllers/animals');
const animalRouter = Router();

animalRouter.get('/', animalController.index);
animalRouter.get('/id/:id', animalController.show);
animalRouter.post('/new', animalController.create);

module.exports = animalRouter;
const { Router } = require('express');

const authenticator = require('../middleware/authenticator');
const animalController = require('../controllers/animals');
const animalRouter = Router();

animalRouter.get('/', animalController.index);
animalRouter.get('/id/:id', animalController.show);
animalRouter.post('/new', animalController.create);
animalRouter.patch('/update/:id', animalController.uploadPhoto)

module.exports = animalRouter;
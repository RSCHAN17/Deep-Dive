const { Router } = require('express');

const authenticator = require('../middleware/authenticator');
const challengesController = require('../controllers/challenges');
const challengesRouter = Router();

challengesRouter.get('/', challengesController.index);


module.exports = challengesRouter;
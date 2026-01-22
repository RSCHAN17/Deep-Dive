const { Router } = require('express');

const authenticator = require('../middleware/authenticator');
const achController = require('../controllers/achievements');
const achRouter = Router();

achRouter.get('/', achController.index);
achRouter.get('/id/:id', achController.show);

module.exports = achRouter;
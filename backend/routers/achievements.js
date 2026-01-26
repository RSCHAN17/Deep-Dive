const { Router } = require('express');

const authenticator = require('../middleware/authenticator');
const achController = require('../controllers/achievements');
const achRouter = Router();

achRouter.get('/', achController.index);
achRouter.get('/id/:id', achController.show);
achRouter.get('/check/:id', achController.checkGet)

module.exports = achRouter;
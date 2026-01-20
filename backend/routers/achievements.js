const { Router } = require('express');

const achController = require('../controllers/achievements');
const achRouter = Router();

achRouter.get('/', achController.index);
achRouter.get('/id/:id', achController.show);

module.exports = achRouter;
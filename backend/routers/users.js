const { Router } = require('express');

const userController = require('../controllers/users');
const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.index)
userRouter.get("/id/:id", userController.show)

module.exports = userRouter;
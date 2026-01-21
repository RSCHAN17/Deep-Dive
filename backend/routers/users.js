const { Router } = require('express');

const userController = require('../controllers/users');
const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.index);
userRouter.get("/id/:id", userController.show);
userRouter.get("/pics/:id", userController.getPFP);
userRouter.patch("/pics/:id", userController.setPFP);
userRouter.get("/title/:id", userController.getTitle);
userRouter.patch("/title/:id", userController.setTitle);

module.exports = userRouter;
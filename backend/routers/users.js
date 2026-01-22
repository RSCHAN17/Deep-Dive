const { Router } = require('express');

const authenticator = require('../middleware/authenticator');
const userController = require('../controllers/users');
const authenticator = require('../middleware/authenticator');
const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.index);

userRouter.get("/id/:id", authenticator, userController.show);
userRouter.get("/pics/:id", authenticator, userController.getPFP);
userRouter.patch("/pics/:id", authenticator, userController.setPFP);
userRouter.get("/title/:id", authenticator, userController.getTitle);
userRouter.patch("/title/:id", authenticator, userController.setTitle);
userRouter.patch("/update/:id", authenticator, userController.updatePassword);


module.exports = userRouter;
const Router = require('express')

const familyController = require('../controllers/families')
const familyRouter = Router()

familyRouter.patch('/update/:id', familyController.uploadPhoto);

module.exports = familyRouter;
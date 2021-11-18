const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');
// routes for users
const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

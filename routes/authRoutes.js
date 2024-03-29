const express = require('express');
const { registerController, loginController, currentControllerUser, resetPasswordController } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

//routes
//register || post
router.post('/register', registerController);

//reset Password
router.post('/resetPassword', resetPasswordController);

//login || post
router.post('/login', loginController);

//get current user || get
router.get('/current-user', authMiddleware, currentControllerUser);

module.exports = router;
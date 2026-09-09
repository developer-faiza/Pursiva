const express = require('express');
const router = express.Router();

const Controller = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.put('/profile', authMiddleware, Controller.updateProfile);
module.exports = router;

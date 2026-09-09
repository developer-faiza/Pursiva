const express = require('express');
const router = express.Router();

const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, ownerController.owner);

router.post('/login', ownerController.ownerLogin);

module.exports = router;

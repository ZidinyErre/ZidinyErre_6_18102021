const express = require('express');
const router = express.Router();

const creatorCtrl = require('../controllers/creator');

router.post('/signup', creatorCtrl.signup);
router.post('/login', creatorCtrl.login);

module.exports = router;
const express = require('express');
const password = require('../middlewares/password');

const router = express.Router();
const userCtrl = require('../controllers/user');


router.post('/signup', password,userCtrl.signup);
router.post('/login',userCtrl.login);

module.exports = router;
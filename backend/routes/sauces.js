const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/sauces', auth, saucesCtrl.getAllSauce);
router.post('/sauces', auth, multer,saucesCtrl.createSauce);
router.get('/sauces/:id', auth, saucesCtrl.getOneSauce);
router.put('/sauces/:id', auth, multer,saucesCtrl.modifySauce);
router.delete('/sauces/:id', auth, saucesCtrl.deleteSauce);
router.post('/sauces/:id/like', auth,saucesCtrl.likesSauce);


module.exports = router;
const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/api/sauces', auth, saucesCtrl.getAllSauce);
router.post('/api/sauces', auth, multer,saucesCtrl.createSauce);
router.get('/api/sauces/:id', auth, saucesCtrl.getOneSauce);
router.put('/api/sauces/:id', auth, multer,saucesCtrl.modifySauce);
router.delete('/api/sauces/:id', auth, saucesCtrl.deleteSauce);
router.post('/api/sauces/:id/like', auth,saucesCtrl.likesSauce);


module.exports = router;
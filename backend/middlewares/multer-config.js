const multer = require('multer');
// Middleware qui va principalement permettre de récupérer et gérer les images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null , 'images');
    },
    filename : (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, `${name + Date.now()}.${extension}`);
    }
});

module.exports = multer({storage : storage}).single('image');
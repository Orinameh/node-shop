const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middlewate/check-auth');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // don't save image
        cb(null, false)
    }
}

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter });


router.get('/', ProductController.GetAllProducts);

router.post('/', checkAuth, upload.single('productImage'), ProductController.CreateProduct);


router.get('/:productId', ProductController.GetSingleProduct);

router.patch('/:productId', checkAuth, ProductController.UpdateProduct);

router.delete('/:productId', checkAuth, ProductController.DeleteProduct);

module.exports = router;
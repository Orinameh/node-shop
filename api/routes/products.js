const express = require('express');
const router = express.Router();
const multer = require('multer');

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

const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find({}).select({ name: 1, price: 1, productImage: 1 }).exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs,
                message: "fetched all products",
            }
            res.status(200).json(response)

        }).catch(err => {
            res.status(500).json({
                err
            })
        })
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(doc => {
        res.status(201).json({
            message: "Product created",
            createdProduct: {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                productImage: doc.productImage
            }
        });
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            err
        });
    })

});


router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('name price _id productImage').exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No valid entry found'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        })

});

router.patch('/:productId', (req, res, next) => {
    const _id = req.params.productId;
    const updateOps = {};
    for (const ops in req.body) {
        updateOps[ops] = req.body[ops]
    }
    Product.update({
        _id
    }, { $set: updateOps }).exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "product updated",
                data: {}
            });
        }).catch(err => {
            res.status(500).json({
                err
            });

        });
});

router.delete('/:productId', (req, res, next) => {
    const _id = req.params.productId;
    Product.remove({
        _id
    }).exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                data: {}
            });
        }).catch(err => {
            res.status(500).json({
                err
            });

        });

});

module.exports = router;
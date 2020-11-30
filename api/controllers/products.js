const mongoose = require('mongoose');
const Product = require('../models/product');


exports.GetAllProducts = (req, res, next) => {
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
}

exports.GetSingleProduct = (req, res, next) => {
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

}

exports.CreateProduct = (req, res, next) => {
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

}

exports.UpdateProduct = (req, res, next) => {
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
}

exports.DeleteProduct =  (req, res, next) => {
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

}
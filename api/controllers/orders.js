const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


exports.GetAllOrders =  (req, res, next) => {
    Order.find().select('quantity product')
    .populate('product', 'name price')
    .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs
            });
        }).catch(err => {
            console.log({ err })
            res.status(500).json({
                err
            });
        })

};

exports.CreateOrder = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(prod => {
            if(!prod) {
                return res.status(404).json({ message: 'Product not found'})
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });

            return order.save();
        }).then(result => {
            res.status(201).json({
                message: "Order was created",
                order: result
            })
        }).catch(err => {
            res.status(500).json({
                message: "Error creating order",
                err
            });
        });


};

exports.GetSingleOrder = (req, res, next) => {
    Order.findById(req.params.orderId).select({quantity: 1, product: 1}).populate('product').exec()
    .then(order => {
        if(!order) {
            res.status(404).json({
                message: "Order not found",
            });
        }
        res.status(200).json({
            message: "Order details",
            order
        });
    }).catch(err => {
        res.status(500).json({
            message: "Error fetching order",
            err
        });
    });
}

exports.DeleteOrder = (req, res, next) => {
    Order.remove({_id: req.params.orderId}).exec()
    .then(result => {
        res.status(200).json({
            message: "Order deleted"
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "Error deleting order",
            err
        });
    })
}
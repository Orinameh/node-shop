const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewate/check-auth');

const OrdersController = require('../controllers/orders');


router.get('/', checkAuth, OrdersController.GetAllOrders);

router.post('/', checkAuth, OrdersController.CreateOrder);

router.get('/:orderId', checkAuth, OrdersController.GetSingleOrder);

// router.patch('/:orderId', (req, res, next) => {
//     res.status(200).json({
//         message: "Order updated",
//         orderId: req.params.orderId
//     });
// });

router.delete('/:orderId', checkAuth, OrdersController.DeleteOrder);

module.exports = router;
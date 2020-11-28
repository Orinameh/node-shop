const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(`mongodb+srv://node-shop:${process.env.MONGO_URL}@cluster0.jxjfv.mongodb.net/node-shop?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mondb not connected");
    console.log(error);
});


app.use(morgan('dev')); 
app.use('/uploads', express.static('uploads')); //makes the uploads folder available

// You don't need bodyParser, this comes with express ie express.urlencoded and express.json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Prevent Cors errors
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
// });
app.use(cors());


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


// Global 404 error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Global 500 error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});




module.exports = app;
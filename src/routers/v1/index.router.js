const app = require('express');

const indexRouter = app.Router();

const productRouter = require('./product.router');
const transactionRouter = require('./transaction.router');

indexRouter.use('/product', productRouter);
indexRouter.use('/transaction', transactionRouter);

module.exports = indexRouter;
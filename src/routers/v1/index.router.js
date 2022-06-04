const app = require('express');

const indexRouter = app.Router();

const productRouter = require('./product.router');

indexRouter.use('/product', productRouter);

module.exports = indexRouter;
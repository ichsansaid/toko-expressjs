const app = require('express');

const indexRouter = app.Router();

const v1Router = require('./v1/index.router');

indexRouter.use('/v1', v1Router);

module.exports = indexRouter;
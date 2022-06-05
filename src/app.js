const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const sessions = require('express-session');
const MongoStore = require('connect-mongo');

const indexRouter = require('./routers/index.router');
const errorHandler = require('./midlewares/error.middleware');

class App {

  constructor(port) {
    this.app = null;
    this.port = port;
  }

  getApp(){
    return this.app;
  }

  connectDb() {
    mongoose.connect('mongodb://localhost:27017/toko-js', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  listen() {
    this.server = this.app.listen(this.port, function () {
      console.log("== Server is running on port", this.port);
    });
  }

  getServer(){
    return this.server;
  }

  initRouter() {
    this.app.use(indexRouter);
  }

  initMiddlewares() {
    this.app.use('/public', express.static('public'))
    this.app.use(express.json());       // to support JSON-encoded bodies
    this.app.use(express.urlencoded({
      extended: true
    }));
    this.app.use(expressLayouts);
    this.app.use(fileUpload());
    const oneDay = 1000 * 60 * 60 * 24;
    this.app.use(sessions({
      secret: "disposisi_mantap_jiwa",
      saveUninitialized: true,
      cookie: { maxAge: oneDay },
      resave: false,
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/toko-js'
      })
    }));
  }

  initErrorHandling() {
    this.app.use(errorHandler);
  }

  initConfig() {
    this.app.set('views', path.join(__dirname, '/template'));
    this.app.set('view engine', 'ejs');
  }

  run() {
    this.app = express();
    this.connectDb();
    this.initMiddlewares()
    this.listen()
    this.initRouter()
    this.initErrorHandling()
    this.initConfig()
  }
}

module.exports = App;
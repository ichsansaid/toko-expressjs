const app = require('express');
const { body, param, validationResult } = require('express-validator');
const { isValidObjectId, Types, default: mongoose } = require('mongoose');

const transactionRouter = app.Router({mergeParams: true});
const childRouter = app.Router({mergeParams: true});
const transactionController = require('../../controllers/transaction.controller');
const ProductModel = require('../../models/product.model');

transactionRouter.post(
  '/create',
  body('tanggal_transaksi')
    .notEmpty().withMessage("Tanggal transaksi harus diisi")
    .isISO8601().withMessage("Tanggal transaksi tidak sesuai format"),
  body('products')
    .isArray().withMessage("Produk harus berisikan daftar")
    .custom(async value=>{
      for(let productId of value){
        if(!isValidObjectId(productId)){
          console.log("Goblok Test" + productId);
          return Promise.reject();
        }
        productId = Types.ObjectId(productId);
        const bool = await ProductModel.exists({_id: productId});
        if(!bool)
          return Promise.reject();
      }
      return true;
    }).withMessage("Daftar produk tidak valid"),
  body('status')
    .customSanitizer(()=> "PENDING"),
  transactionController.createTransaction
);

module.exports = transactionRouter;
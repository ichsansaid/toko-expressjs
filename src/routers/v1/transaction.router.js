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
      for(let { product } of value){
        if(!isValidObjectId(product)){
          return Promise.reject();
        }
        product = Types.ObjectId(product);
        const bool = await ProductModel.exists({_id: product});
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
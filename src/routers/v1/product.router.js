const app = require('express');
const { body, param, validationResult } = require('express-validator');
const { isValidObjectId, Types } = require('mongoose');

const productRouter = app.Router();
const productController = require('../../controllers/product.controllers');
const { productIsExists } = require('../../validators/product.validator');

productRouter.get(
  '/',
  productController.listProduct
);

productRouter.post(
  '/create',
  body('nama')
    .notEmpty().withMessage("Nama harus diisi"),
  body('deskripsi')
    .notEmpty().withMessage("Deskripsi harus diisi"),
  body('harga')
    .notEmpty().withMessage("Harga harus diisi")
    .isNumeric().withMessage("Harga hanya boleh angka"),
  productController.createProduct
);

productRouter.put(
  '/:productId/update',
  param('productId')
    .custom(value => isValidObjectId(value)).withMessage("Produk tidak valid")
    .custom(productIsExists).withMessage("Produk tidak ditemukan"),
  body('nama')
    .notEmpty().withMessage("Nama harus diisi"),
  body('deskripsi')
    .notEmpty().withMessage("Deskripsi harus diisi"),
  body('harga')
    .notEmpty().withMessage("Harga harus diisi")
    .isNumeric().withMessage("Harga hanya boleh angka"),
  productController.updateProduct
);

productRouter.delete('/:productId/delete',
  param('productId')
    .custom(value => isValidObjectId(value)).withMessage("Produk tidak valid")
    .customSanitizer(value => Types.ObjectId(value))
    .custom(productIsExists).withMessage("Produk tidak ditemukan"),
  productController.deleteProduct
);

module.exports = productRouter;
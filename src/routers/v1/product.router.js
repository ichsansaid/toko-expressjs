const app = require('express');
const { body, param, validationResult } = require('express-validator');
const { isValidObjectId, Types, default: mongoose } = require('mongoose');

const productRouter = app.Router({mergeParams: true});
const childRouter = app.Router({mergeParams: true});
const productController = require('../../controllers/product.controllers');
const { productIsExists } = require('../../validators/product.validator');
const isDate = require('../../validators/validator');

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

childRouter.put(
  '/update',
  body('nama')
    .notEmpty().withMessage("Nama harus diisi"),
  body('deskripsi')
    .notEmpty().withMessage("Deskripsi harus diisi"),
  body('harga')
    .notEmpty().withMessage("Harga harus diisi")
    .isNumeric().withMessage("Harga hanya boleh angka"),
  productController.updateProduct
);

childRouter.delete('/delete',
  productController.deleteProduct
);

childRouter.put(
  '/addStok',
  body('jumlah')
    .notEmpty().withMessage("Jumlah harus diisi")
    .isNumeric().withMessage("Jumlah harus berupa angka"),
  body('tanggal')
    .notEmpty().withMessage("Tanggal stok masuk harus diisi")
    .isISO8601().withMessage("Tanggal stok tidak sesuai format"),
  body('keterangan')
    .notEmpty().withMessage("Keterangan harus diisi"),
  body('jenis')
    .isIn(['MASUK', 'KELUAR']).withMessage("Jenis tidak sesuai"),
  productController.addStok
)

productRouter.use('/:productId', 
  param('productId')
    .custom(value => isValidObjectId(value)).withMessage("Produk tidak valid")
    .custom(productIsExists).withMessage("Produk tidak ditemukan"),
  childRouter
)

module.exports = productRouter;
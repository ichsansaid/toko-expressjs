const app = require('express');
const { body, param, validationResult } = require('express-validator');
const { isValidObjectId, Types, default: mongoose } = require('mongoose');

const productRouter = app.Router({mergeParams: true});
const childRouter = app.Router({mergeParams: true});
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
  '/addStokMasuk',
  body('jumlah')
    .notEmpty().withMessage("Jumlah harus diisi")
    .isNumeric().withMessage("Jumlah harus berupa angka"),
  body('tanggal')
    .notEmpty().withMessage("Tanggal stok masuk harus diisi")
    .isDate().withMessage("Tanggal stok masuk harus berupa tanggal"),
  body('keterangan')
    .notEmpty().withMessage("Keterangan harus diisi"),
  productController.addStokMasuk
)

childRouter.put(
  '/addStokKeluar',
  body('jumlah')
    .notEmpty().withMessage("Jumlah harus diisi")
    .isNumeric().withMessage("Jumlah harus berupa angka"),
  body('tanggal')
    .notEmpty().withMessage("Tanggal stok masuk harus diisi")
    .isDate().withMessage("Tanggal stok masuk harus berupa tanggal"),
  body('keterangan')
    .notEmpty().withMessage("Keterangan harus diisi"),
  productController.addStokKeluar
)

productRouter.use('/:productId', 
  param('productId')
    .custom(value => isValidObjectId(value)).withMessage("Produk tidak valid")
    .custom(productIsExists).withMessage("Produk tidak ditemukan"),
  childRouter
)




module.exports = productRouter;
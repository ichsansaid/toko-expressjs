const { validationResult } = require('express-validator');
const { Error } = require('mongoose');
const Exception = require('../exceptions/exception.error');
const ProductModel = require('../models/product.model');

const createProduct = async (req, res, next) =>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    next(new Exception(200, "Mohon periksa kembali inputan anda").withData(errors.array()));
    return;
  }
  const product = new ProductModel({
    nama: req.body.nama,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga
  });
  await product.save();
  res.status(200).json({
    message: "Produk berhasil dibuat",
    data: product
  })
}

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    next(new Exception(200, "Mohon periksa kembali inputan anda").withData(errors.array()));
    return;
  }
  const productQuery = ProductModel.findByIdAndUpdate(req.params.productId, {
    nama: req.body.nama,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga
  });
  const product = await productQuery.exec();
  res.json({
    message: "Produk berhasil diperbaharui",
    data: product
  })
}

const deleteProduct = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    next(new Exception(500, "Data tidak valid").withData(errors.array()));
    return;
  }
  
  const productQuery = ProductModel.findByIdAndDelete(req.params.productId);
  await productQuery.exec();
  res.json({
    message: "Produk berhasil dihapus"
  })
}

const listProduct = async (req, res, next) => {
  const productQuery = ProductModel.find({});
  const products = await productQuery.exec();
  res.json({
    message: "Berikut daftar keseluruhan Produk",
    data: products
  })
}

const addStokMasuk = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    next(new Exception(500, "Data tidak valid").withData(errors.array()));
    return;
  }

  const productQuery = ProductModel.findOne({_id: req.params.productId});
  const product = productQuery.exec();
  product.addStokMasuk(req.body.jumlah, req.body.keterangan, req.body.tanggal ?? new Date());
  res.json({
    message: "Stok product berhasil ditambahkan",
    data: product
  })
}

const addStokKeluar = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    next(new Exception(500, "Data tidak valid").withData(errors.array()));
    return;
  }

  const productQuery = ProductModel.findOne({_id: req.params.productId});
  const product = productQuery.exec();
  product.addStokKeluar(req.body.jumlah, req.body.keterangan, req.body.tanggal ?? new Date());
  res.json({
    message: "Stok product berhasil ditambahkan",
    data: product
  })
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  listProduct,
  addStokMasuk,
  addStokKeluar,
};
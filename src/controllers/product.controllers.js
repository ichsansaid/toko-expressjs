import { create } from "connect-mongo";
import ProductModel from "../models/product.model"

const createProduct = async (req, res) =>{
  const product = new ProductModel({
    nama: req.body.nama,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga
  });
  await product.save();
  res.status(201).json({
    message: "Produk berhasil dibuat",
    data: produk
  })
}

const updateProduct = async (req, res) => {
  const productQuery = ProductModel.findByIdAndUpdate(req.body.id, {
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

const deleteProduct = async (req, res) => {
  const productQuery = ProductModel.findByIdAndDelete(req.body.id);
  await productQuery.exec();
  res.json({
    message: "Produk berhasil dihapus"
  })
}

const listProduct = async (req, res) => {
  const productQuery = ProductModel.find({});
  const products = await productQuery.exec();
  res.json({
    message: "Berikut daftar keseluruhan Produk",
    products: products
  })
}

export default [
  createProduct,
  updateProduct,
  deleteProduct,
  listProduct,
];
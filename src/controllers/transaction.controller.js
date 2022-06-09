const { validationResult } = require('express-validator');
const { Error } = require('mongoose');
const Exception = require('../exceptions/exception.error');
const TransactionModel = require('../models/transaction.model');


const createTransaction = async (req, res, next) =>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    next(new Exception(200, "Mohon periksa kembali inputan anda").withData(errors.array()));
    return;
  }
  const transaction = new TransactionModel({
    tanggal_transaksi: req.body.tanggal_transaksi,
    status: req.body.status,
    products: req.body.products
  });
  await transaction.save();
  res.status(200).json({
    message: "Transaksi berhasil dibuat",
    data: transaction
  })
}

module.exports = {
  createTransaction
}

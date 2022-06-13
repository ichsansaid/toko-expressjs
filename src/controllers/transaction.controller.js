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
  const transaction = await TransactionModel.createTransaction(req.body.products, req.body.tanggal_transaksi);
  res.status(200).json({
    message: "Transaksi berhasil dibuat",
    data: transaction
  })
}

module.exports = {
  createTransaction
}

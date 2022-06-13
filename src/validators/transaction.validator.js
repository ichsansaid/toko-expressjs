const { isValidObjectId, Types } = require("mongoose");
const ProductModel = require("../models/product.model")

const transactionProductValidation = async (value, {req}) =>{
  var product, jumlah;
  for(var i = 0; i < value.length; i++){
    product = value[i].product;
    jumlah = value[i].jumlah;
    if(!isValidObjectId(product)){
      return Promise.reject("Data product tidak valid");
    }
    value[i].product = await ProductModel.findOne({_id: product});
    if(value[i].product == null)
      return Promise.reject("Daftar produk terdapat produk yang tidak ada");
    
    if(value[i].product.getJumlahStok() < jumlah)
      return Promise.reject("Produk dengan nama " + value[i].product.nama + " tidak memiliki stok yang cukup")

  }
  return true;
}

module.exports = {
  transactionProductValidation,
}
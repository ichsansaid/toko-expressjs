const ProductModel = require("../models/product.model")

const productIsExists = async (productId, { req }) =>{
  return await ProductModel.exists({_id: productId});
}

module.exports = {
  productIsExists
}
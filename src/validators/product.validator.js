const ProductModel = require("../models/product.model")

const productIsExists = async (productId, { req }) =>{
  const exist = await ProductModel.exists({_id: productId});
  return exist;
}

module.exports = {
  productIsExists
}
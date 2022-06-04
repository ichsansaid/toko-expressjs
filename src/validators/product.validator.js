const ProductModel = require("../models/product.model")

const productIsExists = () =>{
  return (productId) => {
    return ProductModel.exists({_id: productId})
  }
}

module.exports = {
  productIsExists
}
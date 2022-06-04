const ProductModel = require("../models/product.model")

const productIsExists = () =>{
  return (productId) => {
    console.log(productId);
    return ProductModel.exists({_id: productId})
  }
}

module.exports = {
  productIsExists
}
import mongoose from "mongoose";
const {Schema} = mongoose;

const productSchema = new Schema({
  nama: String,
  deskripsi: String,
  harga: Number,
  stok: [
    {
      tanggal_masuk: Date,
      tanggal_keluar: Date,
      jumlah: Number
    }
  ]
})

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
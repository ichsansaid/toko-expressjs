const mongoose = require('mongoose');
const {Schema} = mongoose;

const transactionSchema = new Schema({
  products: [{
    jumlah: Number,
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'product'
    }
  }],
  tanggal_transaksi: Date,
  status: Boolean,
})
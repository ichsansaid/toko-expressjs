const mongoose = require('mongoose');
const {Schema} = mongoose;

const transactionSchema = new Schema({
  products: [{
    jumlah: Number,
    product: {
      type: Schema.Types.ObjectId,
      ref: 'product'
    }
  }],
  tanggal_transaksi: Date,
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS"]
  },
})

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
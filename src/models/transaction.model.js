const mongoose = require('mongoose');
const ProductModel = require('./product.model');
const StokModel = require('./stok.model');
const {Schema} = mongoose;

const transactionSchema = new Schema({
  stok: [
    {
      type: Schema.Types.ObjectId,
      ref: "stok"
    }
  ],
  tanggal_transaksi: Date,
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS"]
  },
  keterangan: String
})

transactionSchema.statics.createTransaction = async function(products, tanggal_transaksi, keterangan){
  const transaction = new TransactionModel({
    tanggal_transaksi: tanggal_transaksi,
    keterangan: keterangan,
    stok: [],
    status: "PENDING"
  });
  for(let data of products){
    const stok = await data.product.addStokTransaction(data.jumlah, "KELUAR", this.keterangan);
    transaction.stok.push(stok._id);
  }
  transaction.save();
  return transaction;
}

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
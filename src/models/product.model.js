const mongoose = require('mongoose');
const StokModel = require('./stok.model');
const TransactionModel = require('./transaction.model');
const { Schema } = mongoose;

const productSchema = new Schema({
  nama: String,
  deskripsi: String,
  harga: Number
})

productSchema.pre('deleteOne', async function () {
  const doc = await this.model.findOne(this.getFilter());
  if(doc != null){
    const stok = await StokModel.find({product: doc._id});
    await TransactionModel.deleteMany({
      stok: {
        "$in": stok.map(value=>value._id)
      }
    })
    await StokModel.deleteMany({
      product: doc._id
    })
  }
  
})

productSchema.methods.getJumlahStok = async function () {
  let jumlah = 0;
  const stok = await StokModel.find({product: this._id});
  for (let value in this.stok) {
    jumlah += (value.jenis == 'MASUK' ? 1 : -1) * value.jumlah;
  }
  return jumlah;
}

productSchema.methods.getStok = async function() {
  const stok = await StokModel.find({product: this._id});
  return stok;
}

productSchema.methods.addStok = async function (jumlah, jenis, keterangan, tanggal = new Date()) {
  const stok = new StokModel({
    product: this._id,
    jumlah: jumlah,
    keterangan: keterangan,
    tanggal: tanggal,
    jenis: jenis
  })
  await stok.save();
  return stok;
}

productSchema.methods.addStokTransaction = async function (jumlah, keterangan, tanggal = new Date()) {
  const stok = await this.addStok(jumlah, "KELUAR", "Transaction Flow, " + keterangan, tanggal);
  return stok;
}


const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
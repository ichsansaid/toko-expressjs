const mongoose = require('mongoose');
const {Schema} = mongoose;

const stokSchema = new Schema({
  tanggal: Date,
  keterangan: String,
  jenis: {
    type: String,
    enum: ['MASUK', 'KELUAR']
  },
  jumlah: Number,
  product: {
    type: Schema.Types.ObjectId,
    ref: "product"
  }
})

const StokModel = mongoose.model('Stok', stokSchema);

module.exports = StokModel;
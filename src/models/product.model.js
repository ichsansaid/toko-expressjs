const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
  nama: String,
  deskripsi: String,
  harga: Number,
  stok: [
    {
      tanggal: Date,
      keterangan: String,
      jenis: {
        type: String,
        enum: ['MASUK', 'KELUAR']
      },
      jumlah: Number
    }
  ]
})

productSchema.virtual('jumlah_stok').get(()=>{
  let jumlah = 0;
  for(let value in stok){
    jumlah+=(value.jenis == 'MASUK' ? 1 : -1) * value.jumlah;
  }
  return jumlah;
})

productSchema.methods.addStokMasuk = (jumlah, keterangan, tanggal = new Date()) =>{
  this.stok.push({
    tanggal: tanggal,
    jumlah: jumlah,
    keterangan: keterangan
  });
}

productSchema.methods.addStokKeluar = (jumlah, keterangan, tanggal = new Date()) => {
  this.stok.push({
    tanggal: tanggal,
    jumlah: jumlah,
    keterangan: keterangan,
  })
}

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
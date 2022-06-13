const assert = require('assert');
const request = require('supertest');
const expect = require('supertest');
var app = require('../..');
const ProductModel = require('../../src/models/product.model');
const StokModel = require('../../src/models/stok.model');
const TransactionModel = require('../../src/models/transaction.model');

const server = app.getServer();
app = app.getApp();

const product = new ProductModel({
  nama: "NamaTest",
  deskripsi: "DeskripsiTest",
  harga: 5000
});

describe("DELETE /delete", function(){
  it("Membuat produk untuk unit testing", async function(){
    await product.save();
  });
  it("Melakukan penghapusan data", async () =>{
    const id = product._id;
    await request(app)
      .delete('/v1/product/' + product._id + '/delete')
      .send({})
      .set('Accept', 'application/json')
      .expect(200)

    assert.equal(await ProductModel.exists({_id: id}), null, "Produk tidak berhasil dihapus");
    assert.equal(await StokModel.exists({product: id}), null, "Stok produk tidak berhasil dihapus");
    const transaction = await TransactionModel.aggregate([
      {
        $lookup:{
          from: "stok",
          foreignField: "stok",
          localField: "stok",
          as: "stoks"
        }
      },
      {
        $match: {
          'stoks.product': id
        }
      }
    ]);
    assert.equal(transaction.length, 0, "Transaksi produk tidak berhasil dihapus")
  })
})
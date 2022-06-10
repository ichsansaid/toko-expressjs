const assert = require('assert');
const { Types } = require('mongoose');
const request = require('supertest');
const expect = require('supertest');
var app = require('../..');
const ProductModel = require('../../src/models/product.model');
const TransactionModel = require('../../src/models/transaction.model');

const server = app.getServer();
app = app.getApp();

var products = [];
const count = 10;
var transaction;

describe("POST  /transaction", function(){
  it("Tidak internal server error", async function(){
    await request(app)
      .post('/v1/transaction/create')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  it("Membuat products untuk unit testing", async function(){
    var product;
    for(var i = 0; i < count; i++){
      product = new ProductModel({
        nama: "NamaTransactionTest" + i,
        deskripsi: "DeskripsiTransactionTest" + i,
        harga: Math.floor(Math.random() * 900) + 3000
      });
      await product.save();
      products.push({
        jumlah: i+1,
        product: product._id
      });
    }
    transaction = {
      products: products.slice(0, 9),
      tanggal_transaksi: new Date()
    };
    await ProductModel.findByIdAndDelete(product._id);
  })
  it("Validasi field tanggal transaksi kosong", async function(){
    const res = await request(app)
      .post('/v1/transaction/create')
      .send({
        products: products,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa response");
    assert.equal(res.body.data.some(val=>val.param=="tanggal_transaksi"), true, "Tanggal transaksi kosong tidak tervalidasi")
  })
  it("Validasi field tanggal transaksi sesuai format", async function(){
    const res = await request(app)
      .post('/v1/transaction/create')
      .send({
        products: products,
        tanggal_transaksi: "TEST"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa response");
    assert.equal(res.body.data.some(val=>val.param=="tanggal_transaksi"), true, "Tanggal transaksi sesuai format tidak tervalidasi");
  })
  it("Validasi field produk jika tidak sesuai format Id", async function(){
    const res = await request(app)
      .post('/v1/transaction/create')
      .send({
        products: [products[0], { jumlah: 5, product: "Test2" }],
        tanggal_transaksi: new Date()
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa response");
    assert.equal(res.body.data.some(val=>val.param=="products"), true, "Product sesuai tidak tervalidasi");
  })
  it("Validasi field produk jika tidak ditemukan id", async function(){
    const res = await request(app)
      .post('/v1/transaction/create')
      .send({
        products: products,
        tanggal_transaksi: new Date()
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa response");
    assert.equal(res.body.data.some(val=>val.param=="products"), true, "Product ditemukan tidak tervalidasi");
  })
  it("Membuat transaksi", async function(){
    const res = await request(app)
      .post('/v1/transaction/create')
      .send(transaction)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(new Date(res.body.data.tanggal_transaksi).getTime(), transaction.tanggal_transaksi.getTime(), "Tanggal transaksi tidak sesuai");
    transaction = res.body.data;
  })
})

afterAll(async ()=>{
  await ProductModel.deleteMany({_id: { $in : products.map(value=>value.product)}});
  await TransactionModel.findByIdAndDelete(Types.ObjectId(transaction._id));
  server.close();
})

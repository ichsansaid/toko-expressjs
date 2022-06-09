const assert = require('assert');
const request = require('supertest');
const expect = require('supertest');
var app = require('../..');
const ProductModel = require('../../src/models/product.model');

const server = app.getServer();
app = app.getApp();

var productId = [];
const count = 10;

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
    for(var i = 0; i < count; i++){
      const product = new ProductModel({
        nama: "NamaTransactionTest" + i,
        deskripsi: "DeskripsiTransactionTest" + i,
        harga: Math.floor(Math.random() * 900) + 3000
      });
      await product.save();
      productId.push(product._id);
    }
  })
  it("Validasi field tanggal transaksi kosong", async function(){
    const res = await request(app)
      .post('/v1/transaction/create')
      .send({
        products: productId,
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
        products: productId,
        tanggal_transaksi: "TEST"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa response");
    assert.equal(res.body.data.some(val=>val.param=="tanggal_transaksi"), true, "Tanggal transaksi sesuai format tidak tervalidasi");
  })
  it("Validasi field produk jika tidak ditemukan id nya", async function(){
    const res = await request(app)
      .post('/v1/transaction/create')
      .send({
        products: ["Test", "Test2"],
        tanggal_transaksi: new Date()
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa response");
    assert.equal(res.body.data.some(val=>val.param=="products"), true, "Product sesuai tidak tervalidasi");

  })
})

afterAll(async ()=>{
  await ProductModel.deleteMany({_id: { $in : productId}});
  server.close();
})

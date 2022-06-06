const assert = require('assert');
const request = require('supertest');
const expect = require('supertest');
var app = require('../..');
const ProductModel = require('../../src/models/product.model');

const server = app.getServer();
app = app.getApp();

const product = new ProductModel({
  nama: "NamaTest",
  deskripsi: "DeskripsiTest",
  harga: 5000
});

describe("PUT /addStokMasuk", function(){
  it("Membuat produk untuk unit testing", async function(){
    await product.save();
  });
  it("Validasi Product id jika tidak berupa ObjectId", async function(){
    const res = await request(app)
      .put('/v1/product/test/addStokMasuk')
      .send({})
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id berupa ObjectId tidak tervalidasi");
  })
  it("Validasi product id jika tidak ada product", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + 'c/addStokMasuk')
      .send({})
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id ada di Product tidak tervalidasi");
  })
  it("Validasi field tanggal jika tanggal kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStokMasuk')
      .send({
        keterangan: "Test",
        jenis: "MASUK",
        jumlah: 5
      })
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="tanggal"), true, "Tanggal kosong tidak tervalidasi");
  })
  it("Validasi field tanggal jika format tidak sesuai", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStokMasuk')
      .send({
        tanggal: "Mantap",
        keterangan: "Test",
        jenis: "MASUK",
        jumlah: 5
      })
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.filter(val=>val.param=="tanggal").length, 1, "Kegagalan tanggal lebih dari satu");
    assert.equal(res.body.data.some(val=>val.param=="tanggal"), true, "Format tanggal tidak tervalidasi");
  })
  it("Validasi field tanggal jika keterangan kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStokMasuk')
      .send({
        tanggal: new Date(),
        jenis: "MASUK",
        jumlah: 5
      })
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="keterangan"), true, "Keterangan kosong tidak tervalidasi");
  })
  it("Validasi field tanggal jika jenis kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStokMasuk')
      .send({
        tanggal: new Date(),
        keterangan: "Keterangan",
        jumlah: 5
      })
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="jenis"), true, "Jenis kosong tidak tervalidasi");
  })
});

afterAll(async ()=>{
  await ProductModel.findByIdAndDelete(product._id);
  server.close();
})
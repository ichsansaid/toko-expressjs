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

describe("PUT /addStok", function(){
  it("Membuat produk untuk unit testing", async function(){
    await product.save();
  });
  it("Validasi Product id jika tidak berupa ObjectId", async function(){
    const res = await request(app)
      .put('/v1/product/test/addStok')
      .send({})
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id berupa ObjectId tidak tervalidasi");
  })
  it("Validasi product id jika tidak ada product", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + 'c/addStok')
      .send({})
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id ada di Product tidak tervalidasi");
  })
  it("Validasi field tanggal jika tanggal kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStok')
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
      .put('/v1/product/' + product._id + '/addStok')
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
      .put('/v1/product/' + product._id + '/addStok')
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
  it("Validasi field jenis jika kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStok')
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
  it("Validasi field jenis jika tidak sesuai", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStok')
      .send({
        jenis: "bukan",
        tanggal: new Date(),
        keterangan: "Keterangan",
        jumlah: 5
      })
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array");
    assert.equal(res.body.data.some(val=>val.param=="jenis"), true, "Jenis kosong tidak tervalidasi");
  })
  it("Validasi field jumlah jika kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStok')
      .send({
        jenis: "MASUK",
        tanggal: new Date(),
        keterangan: "Keterangan"
      })
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="jumlah"), true, "Jumlah kosong tidak tervalidasi");
  })
  it("Validasi field jumlah jika sesuai format", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStok')
      .send({
        jenis: "MASUK",
        tanggal: new Date(),
        keterangan: "Keterangan",
        jumlah: "Test"
      })
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="jumlah"), true, "Jumlah sesuai format tidak tervalidasi");
  })
  it("Validasi menambah stok", async function(){
    const stok = {
      jenis: "MASUK",
      tanggal: new Date(),
      keterangan: "KeteranganTest",
      jumlah: 10
    }
    const res = await request(app)
      .put('/v1/product/' + product._id + '/addStok')
      .send(stok)
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal('stok' in res.body.data, true, "Data stok response tidak ada");
    assert.equal('product' in res.body.data, true, "Data product response tidak ada");

    const newStok = res.body.data.stok;

    assert.equal(newStok.jenis, stok.jenis, "Field jenis yang tersimpan tidak sesuai");
    assert.equal(new Date(newStok.tanggal).getTime(), stok.tanggal.getTime(), "Field tanggal yang tersimpan tidak sesuai");
    assert.equal(newStok.keterangan, stok.keterangan, "Field keterangan yang tersimpan tidak sesuai");
    assert.equal(newStok.jumlah, stok.jumlah, "Field jumlah yang tersimpan tidak sesuai");
  })
});

afterAll(async ()=>{
  await ProductModel.findByIdAndDelete(product._id);
  server.close();
})
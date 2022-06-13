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

describe("PUT /update", function(){
  it("Buat product untuk testing", async function(){
    await product.save();
  })
  it("Tidak internal server error", function(done){
    request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      })
  })
  it("Validasi Product id jika tidak berupa ObjectId", async function(){
    const res = await request(app)
      .put('/v1/product/test/update')
      .send({})
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id berupa ObjectId tidak tervalidasi");
  })
  it("Validasi product id jika tidak ada product", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + 'c/update')
      .send({})
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id ada di Product tidak tervalidasi");
  })

  it("Validasi field nama jika kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        deskripsi: "Deskripsi",
        harga: 5000
      })
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="nama"), true, "Nama kosong tidak tervalidasi");
  })
  it("Validasi field harga jika kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        nama: "Nama",
        deskripsi: "Deskripsi"
      })
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="harga"), true, "Harga kosong tidak tervalidasi");
  })
  it("Validasi field harga jika bukan angka", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        nama: "Nama",
        deskripsi: "Deskripsi",
        harga: "Test"
      })
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="harga"), true, "Harga harus angka tidak tervalidasi");
  })
  it("Validasi field deskripsi jika kosong", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        nama: "Nama",
        harga: 5000
      })
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array")
    assert.equal(res.body.data.some(val=>val.param=="deskripsi"), true, "Deskripsi kosong tidak tervalidasi");
  })
  it("Validasi update product", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        nama: "NamaGanti",
        deskripsi: "DeskripsiGanti",
        harga: 6000
      })
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.notEqual(res.body.data.nama, product.nama, "Nama belum terganti");
    assert.notEqual(res.body.data.deskripsi, product.deskripsi, "Deskripsi belum terganti");
    assert.notEqual(res.body.data.harga, product.harga, "Harga belum terganti");
  })
})

afterAll(async ()=>{
  await ProductModel.deleteOne({_id: product._id});
  server.close();
})
const assert = require('assert');
const request = require('supertest');
const expect = require('supertest');
var app = require('../..');
const ProductModel = require('../../src/models/product.model');

const server = app.getServer();
app = app.getApp();

var product;
const productTest = {
  nama: "NamaTest",
  deskripsi: "DeskripsiTest",
  harga: 5000
}

describe("POST /create", function(){
  it("Tidak internal server error", function(done){
    request(app)
      .post('/v1/product/create')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      })
  })
  it("Validasi field nama jika kosong", async function(){
    const res = await request(app)
      .post('/v1/product/create')
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
      .post('/v1/product/create')
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
      .post('/v1/product/create')
      .send({
        nama: "Nama",
        deskripsi: "Deskripsi",
        harga: "Test"
      })
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array");
    assert.equal(res.body.data.some(val=>val.param=="harga"), true, "Harga harus angka tidak tervalidasi");
  })
  it("Validasi field deskripsi jika kosong", async function(){
    const res = await request(app)
      .post('/v1/product/create')
      .send({
        nama: "Nama",
        harga: 5000
      })
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(Array.isArray(res.body.data), true, "Data response harus berupa array");
    assert.equal(res.body.data.some(val=>val.param=="deskripsi"), true, "Deskripsi kosong tidak tervalidasi");
  })
  it("Membuat produk", async function(){
    const { body } = await request(app)
      .post('/v1/product/create')
      .set('Accept', 'application/json')
      .send(productTest)
    
    assert.equal(productTest.nama, body.data.nama, "Field nama yang tersimpan tidak sesuai");
    assert.equal(productTest.deskripsi, body.data.deskripsi, "Field deskripsi yang tersimpan tidak sesuai");
    assert.equal(productTest.harga, body.data.harga, "Field harga yang tersimpan tidak sesuai");
    product = body.data;
  })
})

// describe("DELETE /delete", function(){
//   it("Melakukan penghapusan data", async () =>{
//     const res = await request(app)
//       .delete('/v1/product/' + product._id + '/delete')
//       .send({})
//       .set('Accept', 'application/json')
//       .expect(200)
//   })
// })

afterAll(async ()=>{
  await ProductModel.deleteOne({_id: product._id});
  server.close();
})
const assert = require('assert');
const request = require('supertest');
var app = require('../..');

const server = app.getServer();
app = app.getApp();

var product;

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
  it("Validasi field nama jika kosong", function(done){
    request(app)
      .post('/v1/product/create')
      .send({
        deskripsi: "Deskripsi",
        harga: 5000
      })
      .set('Accept', 'application/json')
      .expect(res=>{
        assert.equal(res.body.data.some(val=>val.param=="nama"), true, "Nama kosong tidak tervalidasi")
      })
      .end((err, res)=>{
        if(err) done(err);
        else done()
      })
  })
  it("Validasi field harga jika kosong", function(done){
    request(app)
      .post('/v1/product/create')
      .send({
        nama: "Nama",
        deskripsi: "Deskripsi"
      })
      .set('Accept', 'application/json')
      .expect(res=>{
        assert.equal(res.body.data.some(val=>val.param=="harga"), true, "Harga kosong tidak tervalidasi")
      })
      .end((err, res)=>{
        if(err) done(err);
        else done()
      })
  })
  it("Validasi field harga jika bukan angka", function(done){
    request(app)
      .post('/v1/product/create')
      .send({
        nama: "Nama",
        deskripsi: "Deskripsi",
        harga: "Test"
      })
      .set('Accept', 'application/json')
      .expect(res=>{
        assert.equal(res.body.data.some(val=>val.param=="harga"), true, "Harga angka tidak tervalidasi")
      })
      .end((err, res)=>{
        if(err) done(err);
        else done()
      })
  })
  it("Validasi field deskripsi jika kosong", function(done){
    request(app)
      .post('/v1/product/create')
      .send({
        nama: "Nama",
        harga: 5000
      })
      .set('Accept', 'application/json')
      .expect(res=>{
        assert.equal(res.body.data.some(val=>val.param=="deskripsi"), true, "Deskripsi kosong tidak tervalidasi")
      })
      .end((err, res)=>{
        if(err) done(err);
        else done()
      })
  })
  it("Membuat produk", async function(){
    const { body } = await request(app)
      .post('/v1/product/create')
      .set('Accept', 'application/json')
      .send({
        nama: "ProductTest",
        harga: 5000,
        deskripsi: "Deskripsi Test"
      })
    product = body.data;
  })
})

describe("PUT /update", function(){
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
  it("Validasi field nama jika kosong", function(done){
    request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        deskripsi: "Deskripsi",
        harga: 5000
      })
      .set('Accept', 'application/json')
      .expect(res=>{
        assert.equal(res.body.data.some(val=>val.param=="nama"), true, "Nama kosong tidak tervalidasi")
      })
      .end((err, res)=>{
        if(err) done(err);
        else done()
      })
  })
  it("Validasi field harga jika kosong", function(done){
    request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        nama: "Nama",
        deskripsi: "Deskripsi"
      })
      .set('Accept', 'application/json')
      .expect(res=>{
        assert.equal(res.body.data.some(val=>val.param=="harga"), true, "Harga kosong tidak tervalidasi")
      })
      .end((err, res)=>{
        if(err) done(err);
        else done()
      })
  })
  it("Validasi field harga jika bukan angka", function(done){
    request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        nama: "Nama",
        deskripsi: "Deskripsi",
        harga: "Test"
      })
      .set('Accept', 'application/json')
      .expect(res=>{
        assert.equal(res.body.data.some(val=>val.param=="harga"), true, "Harga angka tidak tervalidasi")
      })
      .end((err, res)=>{
        if(err) done(err);
        else done()
      })
  })
  it("Validasi field deskripsi jika kosong", function(done){
    request(app)
      .put('/v1/product/' + product._id + '/update')
      .send({
        nama: "Nama",
        harga: 5000
      })
      .set('Accept', 'application/json')
      .expect(res=>{
        assert.equal(res.body.data.some(val=>val.param=="deskripsi"), true, "Deskripsi kosong tidak tervalidasi")
      })
      .end((err, res)=>{
        if(err) done(err);
        else done()
      })
  })
})

describe("DELETE /delete", function(){
  it("Tidak internal server error", async () =>{
    console.log('/v1/product/' + product._id + '/delete')
    await request(app)
      .delete('/v1/product/' + product._id + '/delete')
      .send({})
      .set('Accept', 'application/json')
      .expect(200)
  })
})

afterAll(()=>{
  server.close();
})
const assert = require('assert');
const request = require('supertest');
const app = require('../..');

describe("API Test Product", function(){
  var product;
  it("POST /create --> tidak internal server error", function(done){
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
  it("POST /create --> validasi field nama jika kosong", function(done){
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
  it("POST /create --> validasi field harga jika kosong", function(done){
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
  it("POST /create --> validasi field harga jika bukan angka", function(done){
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
  it("POST /create --> validasi field deskripsi jika kosong", function(done){
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
  it("POST /create --> membuat produk", async function(){
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
  //Update
  it("PUT /update --> tidak internal server error", function(done){
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
  it("PUT /update --> validasi field nama jika kosong", function(done){
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
  it("PUT /update --> validasi field harga jika kosong", function(done){
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
  it("PUT /update --> validasi field harga jika bukan angka", function(done){
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
  it("PUT /update --> validasi field deskripsi jika kosong", function(done){
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
  it("DELETE /delete --> tidak internal server error", async () =>{
    console.log('/v1/product/' + product._id + '/delete')
    await request(app)
      .delete('/v1/product/' + product._id + '/delete')
      .send({})
      .set('Accept', 'application/json')
      .expect(200)
  })
})
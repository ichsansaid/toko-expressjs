const assert = require('assert');
const request = require('supertest');
const expect = require('supertest');
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
  it("Validasi field nama jika kosong", async function(){
    const res = await request(app)
      .post('/v1/product/create')
      .send({
        deskripsi: "Deskripsi",
        harga: 5000
      })
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
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
    assert.equal(res.body.data.some(val=>val.param=="deskripsi"), true, "Deskripsi kosong tidak tervalidasi");
  })
  it("Membuat produk", async function(){
    const { body } = await request(app)
      .post('/v1/product/create')
      .set('Accept', 'application/json')
      .send({
        nama: "ProductTest",
        harga: 5000,
        deskripsi: "DeskripsiTest"
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
  it("Validasi Product id jika tidak berupa ObjectId", async function(){
    const res = await request(app)
      .put('/v1/product/test/update')
      .send({})
      .set('Accept', 'application/json');
    
    assert.equal('data' in res.body, true, "Data response tidak ada");
    assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id berupa ObjectId tidak tervalidasi");
  })
  it("Validasi product id jika tidak ada product", async function(){
    const res = await request(app)
      .put('/v1/product/' + product._id + 'c/update')
      .send({})
      .set('Accept', 'application/json');
    assert.equal('data' in res.body, true, "Data response tidak ada");
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

// describe("PUT /addStokMasuk", function(){
//   it("Validasi Product id jika tidak berupa ObjectId", async function(){
//     request(app)
//       .put('/v1/product/test/addStokMasuk')
//       .send({})
//       .set('Accept', 'application/json')
//       .expect(res=>{
//         assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id berupa ObjectId tidak tervalidasi")
//       })
//       .end((err, res)=>{
//         if(err) done(err);
//         else done()
//       })
//   })
//   it("Validasi product id jika tidak ada product", async function(){
//     request(app)
//       .put('/v1/product/' + product._id + 'c/addStokMasuk')
//       .send({})
//       .set('Accept', 'application/json')
//       .expect(res=>{
//         assert.equal(res.body.data.some(val=>val.param=="productId"), true, "Product Id ada di product tidak tervalidasi")
//       })
//       .end((err, res)=>{
//         if(err) done(err);
//         else done()
//       })
//   })
//   it("Validasi field tanggal jika kosong", async function(){
//     request(app)
//       .put('/v1/product/' + product._id + '/addStokMasuk')
//       .send({
//         keterangan: "Test",
//         jenis: "MASUK",
//         jumlah: 5
//       })
//       .set('Accept', 'application/json')
//       .expect(res=>{
//         assert.equal(res.body.data.some(val=>val.param=="tanggal"), true, "Tanggal kosong tidak tervalidasi")
//       })
//       .end((err, res)=>{
//         if(err) done(err);
//         else done()
//       })
//   })
//   it("Validasi field tanggal jika bukan tanggal", async function(){
//     request(app)
//       .put('/v1/product/' + product._id + '/addStokMasuk')
//       .send({
//         tanggal: "Bukan tanggal",
//         keterangan: "Test",
//         jenis: "MASUK",
//         jumlah: 5
//       })
//       .set('Accept', 'application/json')
//       .expect(res=>{
//         assert.equal(res.body.data.some(val=>val.param=="tanggal"), true, "Tanggal bukan tanggal tidak tervalidasi")
//       })
//       .end((err, res)=>{
//         if(err) done(err);
//         else done()
//       })
//   })
// });

describe("DELETE /delete", function(){
  it("Melakukan penghapusan data", async () =>{
    const res = await request(app)
      .delete('/v1/product/' + product._id + '/delete')
      .send({})
      .set('Accept', 'application/json')
      .expect(200)
  })
})

afterAll(()=>{
  server.close();
})
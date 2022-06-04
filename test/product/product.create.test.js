const assert = require('assert');
const request = require('supertest');
const app = require('../..');

describe("API Test Product - create", function(){
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
      .end(function(err, res){
        if(err) return done(err);
        const { body } = res;
        if('data' in body){
          if(body.data.some(val => val.param == "nama")){
            return done();
          }
        }
        return done(new Error("Nama kosong tidak tervalidasi"));
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
      .end(function(err, res){
        if(err) return done(err);
        const { body } = res;
        if('data' in body){
          if(body.data.some(val => val.param == "harga")){
            return done();
          }
        }
        return done(new Error("Harga kosong tidak tervalidasi"));
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
      .end(function(err, res){
        if(err) return done(err);
        const { body } = res;
        if('data' in body){
          if(body.data.some(val => val.param == "harga")){
            return done();
          }
        }
        return done(new Error("Harga angka tidak tervalidasi"));
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
      .end(function(err, res){
        if(err) return done(err);
        const { body } = res;
        if('data' in body){
          if(body.data.some(val => val.param == "deskripsi")){
            return done();
          }
        }
        return done(new Error("Deskripsi kosong tidak tervalidasi"));
      })
  })
})
var request = require('supertest');
var app = require('./../../app.js');

// Love the descriptions! Have nothing to add.. :)
describe("The app", function() {

  //ROUTES
  it('should return 200 OK on GET /', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        // Supertest lets us end tests this way...
        // (useful if we want to check a couple more things with chai)
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should return 200 OK on GET /ingredients', function(done) {
    request(app)
      .get('/ingredients')
      .expect(200)
      .end(function(err, res) {
        // Supertest lets us end tests this way...
        // (useful if we want to check a couple more things with chai)
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should return 200 OK on GET /orders', function(done) {
    request(app)
      .get('/orders')
      .expect(200)
      .end(function(err, res) {
        // Supertest lets us end tests this way...
        // (useful if we want to check a couple more things with chai)
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should return 200 OK on GET /kitchen', function(done) {
    request(app)
      .get('/kitchen')
      .expect(200)
      .end(function(err, res) {
        // Supertest lets us end tests this way...
        // (useful if we want to check a couple more things with chai)
        if (err) {
          return done(err);
        }
        done();
      });
  });

  //RESPONSE ON GET
  it('should respond with the correct html on GET /', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8', done); // ...or this way, inline!
  });

  it('should respond with the correct html on GET /ingredients', function(done) {
    request(app)
      .get('/ingredients')
      .expect('Content-Type', 'text/html; charset=utf-8', done); // ...or this way, inline!
  });

  it('should respond with the correct html on GET /orders', function(done) {
    request(app)
      .get('/orders')
      .expect('Content-Type', 'text/html; charset=utf-8', done); // ...or this way, inline!
  });

  it('should respond with the correct html on GET /kitchen', function(done) {
    request(app)
      .get('/kitchen')
      .expect('Content-Type', 'text/html; charset=utf-8', done); // ...or this way, inline!
  });

  it('should return 404 on GET /notaroute', function(done) {
    request(app)
      .get('/notaroute')
      .expect(404, done);
  });

  //CHECK GET REQUESTS OF SPECIFICS
  it('should return {} on GET nonexistent ingredient', function(done) {
    request(app)
      .get('/ingredient/23129489asf')
      .expect({}, done);
  });

  it('should return {} on GET nonexistent order', function(done) {
    request(app)
      .get('/order/dga1e435')
      .expect({}, done);
  });

  it('should return [] on GET nonexistent ingredient list', function(done) {
    request(app)
      .get('/orderingredients/23129489asf')
      .expect([], done);
  });

  //CHECK POST REQUESTS
  it('should return success when ingredient posted', function(done) {
    var user = {name: 'Beets', 'price': 2};
    request(app)
      .post('/ingredient')
      .send(user)
      .expect(200, done);
  });

  it('should return success when ingredient posted', function(done) {
    var order = {name: 'Zoher', 'totalprice': 20, 'ingredients': ['tomato','lettuce']};
    request(app)
      .post('/order')
      .send(order)
      .expect(200, done);
  });

  //CHECK PATCH/EDIT REQUESTS
  it('should return empty object when nonexistent ingredient edited', function(done) {
    var ingredient_new = {name: 'Beet', 'totalprice': 20};
    request(app)
      .post('/ingredient/353igdd')
      .send(ingredient_new)
      .expect({}, done);
  }); 

  it('should return empty object when nonexistent order edited', function(done) {
    var order_new = {name: 'Beet', 'totalprice': 20};
    request(app)
      .post('/completeorder/35asf3igdd')
      .send(order_new)
      .expect({}, done);
  }); 

  //CHECK DELETE REQUESTS
  it('should return success when ingredient deleted', function(done) {
    request(app)
      .delete('/ingredient/Beets')
      .expect(200, done);
  });


});

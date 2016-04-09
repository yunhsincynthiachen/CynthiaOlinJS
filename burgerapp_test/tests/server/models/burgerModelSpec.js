require('./../../../app'); // to connect to the database
var expect = require('chai').expect;
var Ingredient = require('./../../../models/appModel.js').IngredientModel;
var Burger = require('./../../../models/appModel.js').BurgerModel;

// Awesome work, Cynthia!

describe('Ingredient Model', function() {
  it('should create a new ingredient', function(done) {
    var ingredient = new Ingredient({
      name: 'Beer',
      price: 2,
      quantity: 1,
      outofstock: false
    });
    ingredient.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should remove a ingredient by name', function(done) {
    Ingredient.remove({ name: 'Beer' }, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should create a new ingredient', function(done) {
    var ingredient = new Ingredient({
      name: 'Beer',
      price: 2,
      quantity: 1,
      outofstock: false
    });
    ingredient.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should edit ingredient', function(done) {
    Ingredient.findOne({name: 'Beer'},function(err, ingredient) {
      ingredient.name = 'Wine'
      ingredient.save(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  })
});



describe('Burger Model', function() {
  it('should create a new burger', function(done) {
    var burger = new Burger({
      name: 'Nitya',
      totalprice: 20,
      ingredients: ['lettuce','beer'],
      iscomplete: false
    });
    burger.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should remove a ingredient by name', function(done) {
    Burger.remove({ name: 'Nitya' }, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should create a new burger', function(done) {
    var burger = new Burger({
      name: 'Nitya',
      totalprice: 20,
      ingredients: ['lettuce','beer'],
      iscomplete: false
    });
    burger.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should edit burger', function(done) {
    Burger.findOne({name: 'Nitya'},function(err, burger) {
      burger.name = 'Lola'
      burger.save(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  })
});
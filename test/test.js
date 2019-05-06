var chai = require('chai')
var pacman = require('../pacman_read_file')
var login_test = require('../tdd.js')
assert = chai.assert;
describe('Map', function() {
  describe('map()', function() {
    it('pacman map height should be 30', function() {
      assert.equal(pacman.map().length, 30);
    });
    it('pacman map width should be 28', function() {
      assert.equal(pacman.map()[0].length, 28);
    });
  });
});
describe('TDD', function(){
  describe('login()', function(){
    it('Login should return a string', function(){
      assert.typeOf(login_test.login("a","b"), 'string')
    })
    it('Login failure should be Access denied', function() {
      assert.equal(login_test.login("a","b"), 'Access denied')
    });
    it('Login success should be Access granted', function(){
      assert.equal(login_test.login("a","a"), 'Access granted');
    });
  });
  describe('isPrime()', function(){
    it('isPrime should return a string', function(){
      assert.typeOf(login_test.isPrime(1), 'string')
    });
    it('isPrime should return statement that the number is a prime', function(){
      assert.equal(login_test.isPrime(2), "2 is a prime number");
    });
    it("isPrime should return statement that the number isn't a prime", function(){
      assert.equal(login_test.isPrime(10), "10 isn't a prime number");
    });
  })
});
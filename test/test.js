var chai = require('chai')
var pacman = require('../pacman_read_file.js')
assert = chai.assert;
describe('Map', function() {
  describe('map()', function() {
    it('pacman map height should be 30', function() {
      console.log(pacman.map());
      assert.equal(pacman.map().length, 30);
    });
    it('pacman map width should be 28', function() {
      assert.equal(pacman.map()[0].length, 28);
    });
  });
});

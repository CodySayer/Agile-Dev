var assert = require('assert')
var pacman = require('../pacman_read_file');
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
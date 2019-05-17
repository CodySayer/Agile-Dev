var chai = require('chai')
// var expect = require('../pacman_main')
var supertest = require('supertest')
var should = require('should')
var pacman = require('../pacman_read_file.js')
assert = chai.assert;

var server = supertest.agent("http://localhost:8080");

describe("P0c-Man Unit Test", function () {

  // #1 should return home page

  it("Testing home page", function (done) {

    // calling home page api
    server
      .get("/")
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        // HTTP status should be 200
        res.status.should.equal(200);
        done();
      });
  });
});

var chai = require('chai');
// to fix the issue with Travis CI we would need to have the endpoint somewhere else
// requiring the server means Travis waits for the server to stop before it can finish
// so it just waits till it times out
var expect = require('../pacman_main').server;
var supertest = require('supertest');
var should = require('should');
var pacman = require('../pacman_read_file.js');
assert = chai.assert;

var server = supertest.agent("http://localhost:8080");

describe("P0c-Man Unit Test", function () {

  // #1 should return home page

  it("Testing home page", function (done) {

    // calling home page api
    server
      .get("/")
      .expect(200) // THis is HTTP response
      .end(done());
    server.close();
  });
});

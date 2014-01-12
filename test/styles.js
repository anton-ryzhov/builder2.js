var Builder = require('..').styles

var co = require('co')
var fs = require('fs')
var assert = require('assert')
var Resolver = require('component-resolver')
var Remotes = require('remotes')
var join = require('path').join

var options = {
  install: true,
  remote: new Remotes.GitHub
}

function fixture(name) {
  return join(__dirname, 'fixtures', name)
}

function read(name) {
  return fs.readFileSync(join(fixture(name), 'out.css'), 'utf8').trim()
}

function test(name) {
  describe(name, function () {
    var tree
    var nodes
    var css

    it('should install', co(function* () {
      var resolver = new Resolver(fixture(name), options)
      tree = yield* resolver.tree()
      nodes = resolver.flatten(tree)
    }))

    it('should build', co(function* () {
      var builder = new Builder(nodes)
      css = yield builder.toStr()
    }))

    it('should be correct', function () {
      css.trim().should.equal(read(name))
    })
  })
}

test('css-simple')
test('css-local-ordering')
test('css-url-rewriting')
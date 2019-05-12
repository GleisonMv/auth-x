const x = require('tap')
const test = x.test

const Fastify = require('fastify')

const initialize = (verify, permission, callback, error, empty, errorpermission) => {
  return function (t) {
    class Strategy {
      reply (request, reply, error) {
        t.ok(error, 'reply strategy')
        t.end()
      }
      verify (request, callback) {
        t.ok(true, 'verify strategy')
        callback(error, verify)
      }
      permission (request, perm, callback) {
        t.ok(true, perm)
        t.ok(true, 'permission strategy')
        callback(errorpermission, permission)
      }
    };

    const fastify = Fastify()
    if (empty) {
      fastify.register(require('./../lib/index'))
    } else {
      fastify.register(require('./../lib/index'), {
        strategy: {
          main: new Strategy()
        }
      })
    }

    t.tearDown(() => {
      fastify.close()
    })
    fastify.listen(0, err => {
      t.error(err)
      fastify.server.unref()
      callback(t, fastify, fastify.strategy === undefined ? null : fastify.strategy.main)
    })
  }
}

test('test verify = false auth = false', initialize(true, false, (t, fastify, strategy) => {
  fastify.auth.verify(strategy, false, () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}))

test('test verify = false auth = true', initialize(false, false, function (t, fastify, strategy) {
  fastify.auth.verify(strategy, true, () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}))

test('test verify = true auth = true', initialize(true, false, function (t, fastify, strategy) {
  fastify.auth.verify(strategy, true, () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}))

test('test permission: verify = false', initialize(false, false, function (t, fastify, strategy) {
  fastify.auth.permission(strategy, 'user.test', () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}))

test('test permission: verify = true, permission = false', initialize(true, false, function (t, fastify, strategy) {
  fastify.auth.permission(strategy, 'user.test', () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}))

test('test permission: verify = true, permission = true', initialize(true, true, function (t, fastify, strategy) {
  fastify.auth.permission(strategy, 'user.test', () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}))

test('test error permission 1', initialize(true, true, function (t, fastify, strategy) {
  fastify.auth.permission(strategy, 'user.test', () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}, true, null))

test('test error permission 2', initialize(true, true, function (t, fastify, strategy) {
  fastify.auth.permission(strategy, 'user.test', () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}, null, null, true))

test('test error verify', initialize(true, true, function (t, fastify, strategy) {
  fastify.auth.verify(strategy, true, () => {
    t.ok(true, 'verify callback')
    t.end()
  })(null, null)
}, true, null))

test('test empty', initialize(true, true, function (t, fastify, strategy) {
  t.ok(true, 'verify callback')
  t.end()
}, true, true))

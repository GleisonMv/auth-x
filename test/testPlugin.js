const x = require('tap')
const test = x.test

const Auth = require('../lib/index')
const Fastify = require('fastify')

test('test options 0', function (assert) {
  const fastify = Fastify()
  const plugin = Auth.plugin
  fastify.register(plugin)
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    assert.notEqual(plugin.strategy, undefined)
    assert.end()
  })
})

test('test options 1', function (assert) {
  const fastify = Fastify()
  const plugin = Auth.plugin
  fastify.register(plugin, {})
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    assert.notEqual(plugin.strategy, undefined)
    assert.end()
  })
})

test('test options 2', function (assert) {
  const fastify = Fastify()
  const plugin = Auth.plugin
  fastify.register(plugin, { strategy: true })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    assert.notEqual(plugin.strategy, undefined)
    assert.end()
  })
})

test('test onUserCheck error', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notEqual(request, undefined)
      assert.notEqual(reply, undefined)
      assert.strictEqual(error, Auth.errors.ON_USER_CHECK)
      assert.end()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(new Error('Test'))
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.authenticated(reply, true, function () {
      assert.notOk()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

test('test user not authenticated', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notEqual(request, undefined)
      assert.notEqual(reply, undefined)
      assert.strictEqual(error, Auth.errors.USER_NOT_AUTHENTICATED)
      assert.end()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(null, false)
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.authenticated(reply, true, function () {
      assert.notOk()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

test('test authentication user not allowed', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notEqual(request, undefined)
      assert.notEqual(reply, undefined)
      assert.strictEqual(error, Auth.errors.AUTHENTICATION_USER_NOT_ALLOWED)
      assert.end()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(null, true)
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.authenticated(reply, false, function () {
      assert.notOk()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

test('test onUserCheck done', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notOk()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(null, true)
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.authenticated(reply, true, function () {
      assert.ok(true, 'authenticated')
      assert.end()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

test('test permission onUserCheck error', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notEqual(request, undefined)
      assert.notEqual(reply, undefined)
      assert.strictEqual(error, Auth.errors.ON_USER_CHECK)
      assert.end()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(new Error('Test'))
    }
    onPermissionCheck (request, permission, done) {
      assert.notOk()
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.permission(reply, 20, function () {
      assert.notOk()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

test('test permission onUserCheck not authenticated', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notEqual(request, undefined)
      assert.notEqual(reply, undefined)
      assert.strictEqual(error, Auth.errors.USER_NOT_AUTHENTICATED)
      assert.end()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(null, false)
    }
    onPermissionCheck (request, permission, done) {
      assert.notOk()
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.permission(reply, 20, function () {
      assert.notOk()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

test('test permission onPermissionCheck error', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notEqual(request, undefined)
      assert.notEqual(reply, undefined)
      assert.strictEqual(error, Auth.errors.ON_PERMISSION_CHECK)
      assert.end()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(null, true)
    }
    onPermissionCheck (request, permission, done) {
      assert.notEqual(request, undefined)
      assert.equal(permission, 20)
      done(new Error('Test'))
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.permission(reply, 20, function () {
      assert.notOk()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

test('test permission onPermissionCheck, not has permission', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notEqual(request, undefined)
      assert.notEqual(reply, undefined)
      assert.strictEqual(error, Auth.errors.NOT_HAS_PERMISSION)
      assert.end()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(null, true)
    }
    onPermissionCheck (request, permission, done) {
      assert.notEqual(request, undefined)
      assert.equal(permission, 20)
      done(null, false)
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.permission(reply, 20, function () {
      assert.notOk()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

test('test permission onPermissionCheck, done', function (assert) {
  class Strategy extends Auth.strategy {
    onError (request, reply, error) {
      assert.notOk()
      assert.end()
    }
    onUserCheck (request, callback) {
      assert.notEqual(request, undefined)
      assert.ok(true, 'onUserCheck')
      callback(null, true)
    }
    onPermissionCheck (request, permission, done) {
      assert.notEqual(request, undefined)
      assert.equal(permission, 20)
      assert.ok(true, 'onPermissionCheck')
      done(null, true)
    }
  }
  const fastify = Fastify()
  fastify.register(Auth.plugin, { strategy: new Strategy() })
  fastify.post('/test', function (request, reply) {
    assert.ok(true, 'test')
    request.permission(reply, 20, function () {
      assert.ok(true, 'onPermissionCheck done')
      assert.end()
    })
  })
  assert.tearDown(() => fastify.close())
  fastify.listen(0, err => {
    assert.error(err)
    fastify.server.unref()
    fastify.inject({ method: 'POST', url: '/test' }, (error, response) => {
      assert.error(error)
    })
  })
})

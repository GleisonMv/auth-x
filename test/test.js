'use strict'

var t = require('tap')
var test = t.test

const Fastify = require('fastify')
const authx = require('./../index')

test('test verify = false', t => getInstance({
  reply: (request, reply, error) => {
    t.ok(error, 'reply strategy')
    t.end()
  },
  verify: (request, callback) => {
    t.ok(1, 'verify strategy')
    callback(null, false)
  }
}, (fastify, request, reply) => {
  fastify.authx.verify(request, reply, true, () => {
    t.notOk('verify callback')
    t.end()
  })
}))

test('test verify = true', t => getInstance({
  reply: (request, reply, error) => {
    t.ok(error, 'reply strategy')
    t.end()
  },
  verify: (request, callback) => {
    t.ok(1, 'verify strategy')
    callback(null, true)
  }
}, (fastify, request, reply) => {
  fastify.authx.verify(request, reply, true, () => {
    t.ok(true, 'verify callback')
    t.end()
  })
}))

test('test permission verify = false', t => getInstance({
  reply: (request, reply, error) => {
    t.ok(error, 'reply strategy')
    t.end()
  },
  verify: (request, callback) => {
    t.ok(1, 'verify strategy')
    callback(null, false)
  },
  permission: (request, permission, callback) => {
    t.ok(1, 'permission strategy')
    callback(null, false)
  }
}, (fastify, request, reply) => {
  fastify.authx.permission(request, reply, true, () => {
    t.notOk('verify callback')
    t.end()
  })
}))

test('test permission: verify = true, permission = true', t => getInstance({
  reply: (request, reply, error) => {
    t.ok(error, 'reply strategy')
    t.end()
  },
  verify: (request, callback) => {
    t.ok(1, 'verify strategy')
    callback(null, true)
  },
  permission: (request, permission, callback) => {
    t.ok(1, 'permission strategy')
    callback(null, false)
  }
}, (fastify, request, reply) => {
  fastify.authx.permission(request, reply, true, () => {
    t.notOk('verify callback')
    t.end()
  })
}))

test('test permission: verify = true, permission = true', t => getInstance({
  reply: (request, reply, error) => {
    t.ok(error, 'reply strategy')
    t.end()
  },
  verify: (request, callback) => {
    t.ok(1, 'verify strategy')
    callback(null, true)
  },
  permission: (request, permission, callback) => {
    t.ok(1, 'permission strategy')
    callback(null, true)
  }
}, (fastify, request, reply) => {
  fastify.authx.permission(request, reply, true, () => {
    t.ok(true, 'verify callback')
    t.end()
  })
}))

function getInstance (strategy, callback) {
  const fastify = Fastify()
  fastify.register(authx, {
    strategy: {
      main: strategy
    }
  })
  fastify.listen(0, err => {
    t.error(err)
    fastify.server.unref()
    callback(fastify, { verify: false, permission: false }, {})
  })
}

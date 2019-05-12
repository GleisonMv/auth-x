# fast-auth-x

[![Greenkeeper badge](https://badges.greenkeeper.io/GleisonMv/fast-auth-x.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/GleisonMv/fast-auth-x.svg?branch=master)](https://travis-ci.org/GleisonMv/fast-auth-x)
[![npm](https://img.shields.io/npm/v/fast-auth-x.svg)](https://www.npmjs.com/package/fast-auth-x)
[![Coverage Status](https://coveralls.io/repos/github/GleisonMv/fast-auth-x/badge.svg?branch=master)](https://coveralls.io/github/GleisonMv/fast-auth-x?branch=master)


### Usage
```javascript
const fastify = require('fastify')()

class Strategy {
  reply (request, reply, error) {
    reply.send({ name: 'error', error: error })
  }

  verify (request, callback) {
    callback(null, false)
  }

  permission (request, permission, callback) {
    callback(null, false)
  }
}

const authx = require('fast-auth-x')
const auth = new authx({
  strategy: {
    name: new Strategy()
  }
})

fastify.get('/auth', auth.verify(auth.strategy.name, true, (request, reply) => {
  reply.send({ text: 'hello world' })
}))

fastify.get('/not-auth', auth.verify(auth.strategy.name, false, (request, reply) => {
  reply.send({ text: 'hello world' })
}))

fastify.get('/permission', auth.permission(auth.strategy.name, 'user.info', (request, reply) => {
  reply.send({ text: 'hello world' })
}))

fastify.listen(3000)

```

## Code of errors in reply
1. Error Issued While Checking
2. Unauthenticated error
3. Error can not be authenticated
4. Error Issued While Checking Permission
5. No permission

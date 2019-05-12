'use strict'

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

module.exports = Strategy

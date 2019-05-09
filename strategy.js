'use strict'

/**
 * Sample
 */
module.exports = {

  reply: function (request, reply, error) {
    reply.send({ name: 'auth-x-error', error: error })
  },

  verify: function (request, callback) {
    callback(null, false)
  },

  permission: function (request, permission, callback) {
    callback(null, false)
  }
}

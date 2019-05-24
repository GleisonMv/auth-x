const fp = require('fastify-plugin')
const Strategy = require('./strategy')
const Errors = require('./error')

/**
 * Plugin
 */
const auth = fp((fastify, opts, next) => {
  opts = checkOptions(opts)
  fastify.decorateRequest('authenticated', authenticated)
  fastify.decorateRequest('permission', permission)
  auth.strategy = opts.strategy
  next()
})

/**
 * Check the options
 *
 * @param {*} opts
 */
function checkOptions (opts) {
  if (!opts || !opts.strategy || !(opts.strategy instanceof Strategy)) {
    opts = { strategy: new Strategy() }
    console.log('fast-auth-x set default options')
  }
  return opts
}

/**
 * Verify Authentication
 *
 * If authenticated = true, you will need to be authenticated.
 * If authenticated = false, it can not be authenticated.
 *
 * @param fastify.Reply reply
 * @param Boolean authenticated
 * @param function done
 */
function authenticated (reply, authenticated, done) {
  const request = this
  auth.strategy.onUserCheck(request, (error, authenticatedResult) => {
    if (error) {
      auth.strategy.onError(request, reply, Errors.ON_USER_CHECK)
    } else if (authenticated && !authenticatedResult) {
      auth.strategy.onError(request, reply, Errors.USER_NOT_AUTHENTICATED)
    } else if (!authenticated && authenticatedResult) {
      auth.strategy.onError(request, reply, Errors.AUTHENTICATION_USER_NOT_ALLOWED)
    } else {
      done()
    }
  })
}

/**
 * Verify permission
 *
 * @param fastify.Reply reply
 * @param {*} permission
 * @param function done
 */
function permission (reply, permission, done) {
  const request = this
  auth.strategy.onUserCheck(request, (error, authenticatedResult) => {
    if (error) {
      auth.strategy.onError(request, reply, Errors.ON_USER_CHECK)
    } else if (authenticated && !authenticatedResult) {
      auth.strategy.onError(request, reply, Errors.USER_NOT_AUTHENTICATED)
    } else {
      auth.strategy.onPermissionCheck(request, permission, (error, permissionResult) => {
        if (error) {
          auth.strategy.onError(request, reply, Errors.ON_PERMISSION_CHECK)
        } else if (!permissionResult) {
          auth.strategy.onError(request, reply, Errors.NOT_HAS_PERMISSION)
        } else {
          done()
        }
      })
    }
  })
}

module.exports = auth

'use strict'

const fp = require('fastify-plugin')

const decorate = {}
const authx = module.exports = fp((fastify, opts, next) => {
  if (opts === undefined) opts = {}
  authx.strategy = opts.strategy !== undefined ? opts.strategy : {}
  if (authx.strategy.main === undefined) authx.strategy.main = require('./strategy')
  fastify.decorate('authx', decorate)
  next()
})

/**
 * Verify Authentication
 *
 * @param request    Fastify Request
 * @param reply      Fastify reply
 * @param auth       Permission
 * @param done       Callback continue
 * @param strategy   Name of the strategy defined in plugin option
 */
decorate.verify = (request, reply, auth, done, strategy) => {
  strategy = (strategy === undefined || authx.strategy[strategy] === undefined)
    ? authx.strategy.main
    : authx.strategy[strategy]
  strategy.verify(request, (ev, rv) => {
    if (ev) strategy.reply(request, reply, 1)
    else if (auth && !rv) strategy.reply(request, reply, 2)
    else if (!auth && rv) strategy.reply(request, reply, 3)
    else done()
  })
}

/**
 * Verify the permission, it is necessary to be authenticated
 *
 * @param request    Fastify Request
 * @param reply      Fastify reply
 * @param permission Permission
 * @param done       Callback continue
 * @param strategy   Name of the strategy defined in plugin option
 */
decorate.permission = (request, reply, permission, done, strategy) => {
  strategy = (strategy === undefined || authx.strategy[strategy] === undefined)
    ? authx.strategy.main
    : authx.strategy[strategy]
  strategy.verify(request, (ev, rv) => {
    if (ev) strategy.reply(request, reply, 1)
    else if (!rv) strategy.reply(request, reply, 2)
    else {
      strategy.permission(request, permission, (ep, rp) => {
        if (ep) strategy.reply(request, reply, 4)
        else if (!rp) strategy.reply(request, reply, 5)
        else done()
      })
    }
  })
}

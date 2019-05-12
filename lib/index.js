'use strict'

const fp = require('fastify-plugin')

const plugin = fp((fastify, opts, next) => {
  if (opts.strategy === undefined) {
    console.log('Need option strategy: { name: instance }')
    console.log('fastify.auth.verify(fastify.strategy.name, isAuth, callback)....')
    console.log('fastify.auth.permission(fastify.strategy.name, permission, callback)....')
  }

  fastify.decorate('strategy', opts.strategy)
  fastify.decorate('auth', {

    verify: (strategy, auth, done) => {
      return function (request, reply) {
        strategy.verify(request, (error, isAuth) => {
          if (error) strategy.reply(request, reply, 1)
          else if (auth && !isAuth) strategy.reply(request, reply, 2)
          else if (!auth && isAuth) strategy.reply(request, reply, 3)
          else done()
        })
      }
    },

    permission: (strategy, permission, done) => {
      return function (request, reply) {
        strategy.verify(request, (error, isAuth) => {
          if (error) strategy.reply(request, reply, 1)
          else if (!isAuth) strategy.reply(request, reply, 2)
          else {
            strategy.permission(request, permission, (err, isGranted) => {
              if (err) strategy.reply(request, reply, 4)
              else if (!isGranted) strategy.reply(request, reply, 5)
              else done()
            })
          }
        })
      }
    }
  })

  next()
})

module.exports = plugin

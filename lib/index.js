'use strict'

class Auth {
  constructor (opts = {}) {
    if (opts.strategy === undefined) {
      console.log('Need option strategy: { name: instance }')
      console.log('auth.verify(auth.strategy.name, isAuth, callback)....')
      console.log('auth.permission(auth.strategy.name, permission, callback)....')
    }

    this.strategy = opts.strategy
  }

  verify (strategy, auth, done) {
    return function (request, reply) {
      strategy.verify(request, (error, isAuth) => {
        if (error) strategy.reply(request, reply, 1)
        else if (auth && !isAuth) strategy.reply(request, reply, 2)
        else if (!auth && isAuth) strategy.reply(request, reply, 3)
        else done(request, reply)
      })
    }
  }

  permission (strategy, permission, done) {
    return function (request, reply) {
      strategy.verify(request, (error, isAuth) => {
        if (error) strategy.reply(request, reply, 1)
        else if (!isAuth) strategy.reply(request, reply, 2)
        else {
          strategy.permission(request, permission, (err, isGranted) => {
            if (err) strategy.reply(request, reply, 4)
            else if (!isGranted) strategy.reply(request, reply, 5)
            else done(request, reply)
          })
        }
      })
    }
  }
}

module.exports = Auth

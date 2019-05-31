import * as Fastify from "fastify"
import sample from "../fast-auth-x"

const fastify = Fastify()

class Strategy extends sample.strategy {

    onError(request, reply, error: number)
    {
    }   

    onPermissionCheck(request, done: (err, auth?) => void)
    {
    }

    onUserCheck(request, permission, done: (err, permission?) => void)
    {
    }
  
}

fastify.register(sample.plugin, {
    strategy: new Strategy
});


fastify.get('/login', (request, reply) => {
    request.authenticated(reply, false, function () {
        reply.send({ hello: 'login page' });
    })
})

fastify.get('/home', (request, reply) => {
    request.authenticated(reply, true, function () {
        reply.send({ hello: 'home page' });
    })
})

fastify.get('/home/admin', (request, reply) => {
    request.permission(reply, "user.admin", function () {
        reply.send({ hello: 'admin page' });
    })
})

fastify.listen(3000, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
})
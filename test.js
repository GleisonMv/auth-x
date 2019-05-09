'use strict'

const fastify = require('fastify')({
    logger: true
})

fastify.register(require("./index.js"), {
    strategy: {
        test:
        {
            reply: (request, reply, error) => reply.send({ name: "auth-x-error", error: error }),
            verify: (request, callback) => callback(null, request.verify == true),
            permission: (request, permission, callback) => callback(null, request.permission == true)
        }
    }
});

fastify.get('/', function (request, reply) {
    reply.type('text/html');
    reply.send(
        "<h1> Sample test</h1>" +
        "<h3> Error code</h3> <ul>" +
        "<li>1 - Error checking</li>" +
        "<li>2 - Not authenticated</li>" +
        "<li>3 - Authenticated, Not allowed</li>" +
        "<li>4 - Error checking permission</li>" +
        "<li>5 - No permission </li>" +
        "</ul>" +
        "Auth<br><iframe src='http://localhost:3000/auth'></iframe><br>" +
        "Not-auth<br><iframe src='http://localhost:3000/not-auth'></iframe><br>" +
        "Auth-test<br><iframe src='http://localhost:3000/auth-test'></iframe><br>" +
        "Not-auth-test<br><iframe src='http://localhost:3000/not-auth-test'></iframe><br>" +
        "Permission<br><iframe src='http://localhost:3000/permission'></iframe><br>" +
        "Permission-test<br><iframe src='http://localhost:3000/permission-test'></iframe><br>"+
        "Permission-verify<br><iframe src='http://localhost:3000/permission-verify'></iframe><br>"
    );
});

fastify.get('/auth', function (request, reply) {
    fastify.authx.verify(request, reply, true, () => {
        reply.send({ name: 'Hello World!' })
    });
})

fastify.get('/not-auth', function (request, reply) {
    fastify.authx.verify(request, reply, false, () => {
        reply.send({ name: 'Hello World!' })
    });
})

fastify.get('/auth-test', (request, reply) => {
    request.verify = true;
    fastify.authx.verify(request, reply, true, () => {
        reply.send({ name: 'Hello World!' })
    }, "test");
})

fastify.get('/not-auth-test', function (request, reply) {
    request.verify = true;
    fastify.authx.verify(request, reply, false, () => {
        reply.send({ name: 'Hello World!' })
    }, "test");
})

fastify.get('/permission', (request, reply) => {
    request.verify = true;
    fastify.authx.permission(request, reply, "user.read", () => {
        reply.send({ name: 'Hello World!' })
    }, "test");
})

fastify.get('/permission-test', (request, reply) => {
    request.permission = true;
    request.verify = true;
    fastify.authx.permission(request, reply, "user.read", () => {
        reply.send({ name: 'Hello World!' })
    }, "test");
})

fastify.get('/permission-verify', (request, reply) => {
    fastify.authx.permission(request, reply, "user.read", () => {
        reply.send({ name: 'Hello World!' })
    });
})

fastify.listen(3000, function (err, address) {
    if (err) fastify.log.error(err)
    fastify.log.info(`server listening on ${address}`)
})
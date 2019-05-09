'use strict'

const fp = require("fastify-plugin");

const decorate = {};
const authx = module.exports = fp((fastify, opts, next) => {
    authx.strategy = opts.strategy != undefined ? opts.strategy : {};
    authx.strategy.main = require("./strategy");
    fastify.decorate("authx", decorate);
    next();
});

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
    strategy = (strategy == undefined || authx.strategy[strategy] == undefined)
        ? authx.strategy.main
        : authx.strategy[strategy];
    strategy.verify(request, (err_verify, result_verify) => {
        if (err_verify) strategy.reply(request, reply, 1);
        else if (auth && !result_verify) strategy.reply(request, reply, 2);
        else if (!auth && result_verify) strategy.reply(request, reply, 3);
        else done();
    });
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
    strategy = (strategy == undefined || authx.strategy[strategy] == undefined)
        ? authx.strategy.main
        : authx.strategy[strategy];
    strategy.verify(request, (err_verify, result_verify) => {
        if (err_verify) strategy.reply(request, reply, 1);
        else if (!result_verify) strategy.reply(request, reply, 2);
        else strategy.permission(request, permission, (err_permission, result_permission) => {
            if (err_permission) strategy.reply(request, reply, 4);
            else if (!result_permission) strategy.reply(request, reply, 5);
            else done();
        });
    });
}
## fast-auth-x

[![Greenkeeper badge](https://badges.greenkeeper.io/GleisonMv/fast-auth-x.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/GleisonMv/fast-auth-x.svg?branch=master)](https://travis-ci.com/GleisonMv/fast-auth-x)
![npm](https://img.shields.io/npm/v/fast-auth-x.svg)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=GleisonMv_fast-auth-x&metric=ncloc)](https://sonarcloud.io/dashboard?id=GleisonMv_fast-auth-x)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=GleisonMv_fast-auth-x&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=GleisonMv_fast-auth-x)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=GleisonMv_fast-auth-x&metric=security_rating)](https://sonarcloud.io/dashboard?id=GleisonMv_fast-auth-x)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=GleisonMv_fast-auth-x&metric=alert_status)](https://sonarcloud.io/dashboard?id=GleisonMv_fast-auth-x)

Documentação - [Documentation](https://github.com/GleisonMv/fast-auth-x/blob/master/README.md).

Plugin de Autenticação para [Fastify](http://fastify.io/).
Inspirado em permissões e Estratégia.

1. [Como utilizar](#como-utilizar)
2. [Como utilizar com sua a estratégia](#como-utilizar-com-sua-a-estratégia)
3. [Como desenvolver sua estratégia](como-desenvolver-sua-estratégia)
4. [Código dos erros](#código-dos-erros)

## Como utilizar.

```javascript
const fastify = require("fastify")();

/**
 * Registramos o fast-auth-x com a Estratégia Padrão 
 * (Não recomendado para produção), passe em option uma strategy main
 */
fastify.register(require("fast-auth-x"))

/**
 * Verifica se está autenticado
 */
fastify.get("/secure", (request, reply) => {
    fastify.authx.verify(request, reply, true, () => {
        reply.send({ message: "Hello World!" });
    });
});

/**
 * Não pode estar autenticado
 */
fastify.get("/login", (request, reply) => {
    fastify.authx.verify(request, reply, false, () => {
        reply.send({ message: "Hello World!" });
    });
});

/**
 * Verifica a permissão
 */
fastify.get("/permission", (request, reply) => {
    fastify.authx.permission(request, reply, "user.home", () => {
        reply.send({ message: "Hello World!" });
    });
});

/**
 * Inicia o servidor
 */
fastify.listen(3000, err => {
    if (err)
    {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
})
```

## Como utilizar com sua a estratégia

```javascript
const fastify = require("fastify")();

fastify.register(require("fast-auth-x"), {

    /* Estratégias */
    strategy: {

        /* Estratégia principal */
        main: {
        
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
    }
})

fastify.get("/secure", (request, reply) => fastify.authx.verify(request, reply, true, () => {
    reply.send({ message: "Hello World!" });
}));

fastify.get("/login", (request, reply) => fastify.authx.verify(request, reply, false, () => {
    reply.send({ message: "Hello World!" });
}));

fastify.get("/permission", (request, reply) => fastify.authx.permission(request, reply, "user.home", () => {
    reply.send({ message: "Hello World!" });
}));

fastify.listen(3000, err => {
    if (err)
    {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
})
```

### Como desenvolver sua estratégia.

A definição da estratégia requer um objeto com as funções:
``` javascript
/**
 * Exporta o módulo da estratégia
 */
module.exports = {

  /**
     * Função de reposta para o erro, caso não complete os requisitos da funções abaixo
     *
     * @param {*} request Requisição do fastify
     * @param {*} reply fastify Reply
     * @param {*} error erro
     */
  reply: function (request, reply, error) {
    reply.send({ name: 'auth-x-error', error: error })
  },

  /**
     * Verifica se está autenticado
     *
     * @param {*} request Requisição do fastify
     * @param {*} callback Callback de resposta (Error, Boolean)
     */
  verify: function (request, callback) {
    callback(null, false)
  },

  /**
     * Verifica a permissão
     *
     * @param {*} request Requisição do fastify
     * @param {*} permission Permissão
     * @param {*} callback Callback de resposta (Error, Boolean)
     */
  permission: function (request, permission, callback) {
    callback(null, false)
  }
}
```
## Código dos erros

1: Erro emitido ao verificar  
2: Erro não autenticado  
3: Erro não pode estar autenticado  
4: Erro emitido ao verificar a permissão  
5: Sem permissão  

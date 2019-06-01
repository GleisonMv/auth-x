import * as fastify from 'fastify';
import * as http from 'http';

declare module 'fastify' {

    interface FastifyRequest<HttpRequest>
    {
        authenticated(reply: fastify.FastifyReply<any>, auth: boolean, done: () => void):void;
        permission(reply: fastify.FastifyReply<any>, permission: any, done: () => void):void;
    }
}

declare abstract class strategy
{
    abstract onError(request: any, reply: any, error: number):void;
    abstract onPermissionCheck(request: any, done: (err: Error, auth?: boolean) => void):void;
    abstract onUserCheck(request: any, permission: any, done: (err: Error, permission?: boolean) => void):void;
}

declare const errors: {
    AUTHENTICATION_USER_NOT_ALLOWED: number;
    NOT_HAS_PERMISSION: number;
    ON_PERMISSION_CHECK: number;
    ON_USER_CHECK: number;
    USER_NOT_AUTHENTICATED: number;
};

declare interface Options
{
    strategy: strategy
}

declare const plugin: fastify.Plugin<http.Server, http.IncomingMessage, http.ServerResponse, Options>;
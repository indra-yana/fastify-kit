const AuthValidator = require('../../validator/AuthValidator');
const AuthHandler = require('./handler');
const routes = require('./routes');

function api(fastify, opts = {}, done) {
    const mailerService = fastify.Service.get('mailer');
    const storageService = fastify.Service.get('storage');
    const loginService = fastify.Service.get('login');
    const registerService = fastify.Service.get('register');
    const forgotPasswordService = fastify.Service.get('forgot');
    const verificationService = fastify.Service.get('verification');
    const validator = new AuthValidator({ fastify });

    const handler = new AuthHandler(mailerService, storageService, loginService, registerService, forgotPasswordService, verificationService, validator);

    routes(fastify, { handler }).forEach((route) => {
        fastify.route(route);
    });

    done();
}

module.exports = api;
const AuthValidator = require('../../validator/AuthValidator');
const AuthHandler = require('./handler');
const routes = require('./routes');

function api(fastify, opts = {}, done) {
    const authService = fastify.Service.get('atuh');
    const mailerService = fastify.Service.get('mailer');
    const storageService = fastify.Service.get('storage');
    const validator = new AuthValidator();

    const authHandler = new AuthHandler(authService, mailerService, storageService, validator);

    routes(fastify, { handler: authHandler }).forEach((route) => {
        fastify.route(route);
    });

    done();
}

module.exports = api;
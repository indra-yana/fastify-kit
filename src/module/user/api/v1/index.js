const routes = require('./routes');
const UserHandler = require('./handler');
const UserValidator = require('../../validator/UserValidator');

function api(fastify, opts = {}, done) {
    const userService = fastify.Service.get('user');
    const storageService = fastify.Service.get('storage');
    const validator = new UserValidator({ fastify });

    const handler = new UserHandler(userService, storageService, validator);

    routes(fastify, { handler }).forEach((route) => {
        fastify.route(route);
    });

    done();
}

module.exports = api;
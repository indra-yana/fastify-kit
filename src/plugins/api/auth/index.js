const fp = require('fastify-plugin');
const AuthHandler = require('./handler');
const routes = require('./routes');

const meta = {
    name: '@compsys/authPlugin',
    version: '1.0',
};

module.exports = fp(function (fastify, opts, done) {
    const { service, mailerService, storageService, validator } = opts;
    const authHandler = new AuthHandler(service, mailerService, storageService, validator);

    routes(fastify, { handler: authHandler, meta }).forEach((route) => {
        fastify.route(route);
    });
    
    done();
}, meta);
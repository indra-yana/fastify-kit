const fp = require('fastify-plugin');
const UserHandler = require('./handler');
const routes = require('./routes');

const meta = {
    name: '@compsys/userPlugin',
    version: '1.0',
};

module.exports = fp(function (fastify, opts, done) {
    const { service, storageService, validator } = opts;
    const userHandler = new UserHandler(service, storageService, validator);

    routes(fastify, { handler: userHandler, meta }).forEach((route) => {
        fastify.route(route);
    });
    
    done();
}, meta);
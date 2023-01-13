const fp = require('fastify-plugin');
const RoleHandler = require('./handler');
const routes = require('./routes');

const meta = {
    name: '@compsys/rolePlugin',
    version: '1.0',
};

module.exports = fp(function (fastify, opts, done) {
    const { service, validator } = opts;
    const roleHandler = new RoleHandler(service, validator);

    routes(fastify, { handler: roleHandler, meta }).forEach((route) => {
        fastify.route(route);
    });
    
    done();
}, meta);
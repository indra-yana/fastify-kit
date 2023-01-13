const fp = require('fastify-plugin');
const apiV1 = require('./api/v1');

async function userModule(fastify, opts, done) {
    fastify.register(apiV1, { prefix: '/api/v1' });

    done();
}

module.exports = fp(userModule, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/user-module`,
    version: '1.0',
});
const fp = require('fastify-plugin');
const apiV1 = require('./api/v1');

async function roleModule(fastify, opts, done) {
	fastify.register(apiV1, { prefix: '/api/v1' });

	done();
}

module.exports = fp(roleModule, {
	name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/role-module`,
	version: '1.0',
});
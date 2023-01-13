const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');
const authConfig = require('../config/auth');

function jwt(fastify, opts = {}, done) {
	fastify.register(fastifyJwt, authConfig.jwt.default);
	fastify.decorate('jwtAuthStrategy', async (request, reply) => {
		try {
			await request.jwtVerify();
		} catch (error) {
			reply.error(error);
		}
	});

	done();
}

module.exports = fp(jwt, {
	name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/jwt-auth`,
	version: '1.0',
});
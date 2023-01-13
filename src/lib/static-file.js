const fp = require('fastify-plugin');
const path = require('path');
const fastifyStatic = require('@fastify/static');

function staticFile(fastify, opts = {}, done) {
	fastify.register(fastifyStatic, {
		root: path.join(`${__dirname}../../`),
		prefix: '/',
		wildcard: true,
	});

	// Serve assets file
	fastify.get('/assets/*', async (request, reply) => {
		return reply.sendFile(`public/assets/${request.params['*']}`);
	});

	done();
}

module.exports = fp(staticFile, {
	name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/static-file`,
	version: '1.0',
});
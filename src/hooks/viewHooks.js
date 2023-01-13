const fp = require('fastify-plugin');

function hooks(fastify, opts = {}, done) {
	fastify.addHook('onRequest', (request, reply, next) => {
		request.vars = {
			view: fastify.view,
			...request.vars,
		};

		next();
	});

	done();
}

module.exports = fp(hooks, {
	name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/view-hooks`,
	version: '1.0',
});
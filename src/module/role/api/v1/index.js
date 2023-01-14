const RoleValidator = require('../../validator/RoleValidator');
const RoleHandler = require('./handler');
const routes = require('./routes');

function api(fastify, opts = {}, done) {
	const roleService = fastify.Service.get('role');
	const validator = new RoleValidator({ fastify });

	const handler = new RoleHandler(roleService, validator);

	routes(fastify, { handler }).forEach((route) => {
		fastify.route(route);
	});

	done();
}

module.exports = api;
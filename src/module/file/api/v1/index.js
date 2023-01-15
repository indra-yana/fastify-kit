const FileValidator = require('../../validator/FileValidator');
const FileHandler = require('./handler');
const routes = require('./routes');

function api(fastify, opts = {}, done) {
	const fileService = fastify.Service.get('file');
	const storageService = fastify.Service.get('storage');
	const validator = new FileValidator({ fastify });

	const handler = new FileHandler(fileService, storageService, validator);

	routes(fastify, { handler }).forEach((route) => {
		fastify.route(route);
	});

	done();
}

module.exports = api;
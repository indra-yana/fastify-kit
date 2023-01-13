const fp = require('fastify-plugin');
const path = require('path');
const multer = require('fastify-multer');

function jwt(fastify, opts = {}, done) {
	fastify.decorate('upload', multer({
		dest: path.join(__dirname, '../../public/temp'),
		limits: { fileSize: 1024 * 1024 * 50 },		// 50MB for default limit file size
	}));

	fastify.register(multer.contentParser);

	done();
}

module.exports = fp(jwt, {
	name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/upload`,
	version: '1.0',
});
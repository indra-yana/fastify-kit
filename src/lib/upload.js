const fp = require('fastify-plugin');
const path = require('path');
const multer = require('fastify-multer');

function upload(fastify, opts = {}, done) {
	const root = path.resolve('public/temp');

	fastify.decorate('upload', multer({
		dest: root,
		limits: { fileSize: 1024 * 1024 * 50 },		// 50MB for default limit file size
	}));

	fastify.register(multer.contentParser);

	done();
}

function getUploadDirectory(type, uuid = null) {
	let dir = 'uploads';
	if (type === 'evidence') {
		dir += '/evidence';
	} else if (type === 'avatar') {
		dir += '/avatar';
	} else {
		throw new Error('Unknown type!');
	}

	if (uuid) {
		dir += `/${uuid}`;
	}

	return dir
}

module.exports = fp(upload, {
	name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/upload`,
	version: '1.0',
});

module.exports.getUploadDirectory = getUploadDirectory;
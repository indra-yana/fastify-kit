const fp = require('fastify-plugin');
const path = require('path');

/**
 * User plugin
 */
const userPlugin = require('./user');
const UserService = require('../../services/objection/UserService');
const UserValidator = require('../../validator/joi/UserValidator');
 
/**
 * Auth plugin
 */
const authPlugin = require('./auth');
const AuthService = require('../../services/jwt/AuthService');
const AuthValidator = require('../../validator/joi/AuthValidator');
const MailerService = require('../../services/common/MailerService');

/**
 * Upload plugin
 */
const uploadPlugin = require('./upload');
const StorageService = require('../../services/storage/StorageService');
const UploadValidator = require('../../validator/joi/UploadValidator');

/**
 * File service
 */
const FileService = require('../../services/objection/FileService');

/**
 * Role plugin
 */
 const rolePlugin = require('./role');
 const RoleService = require('../../services/objection/RoleService');
 const RoleValidator = require('../../validator/joi/RoleValidator');

const meta = {
    name: '@compsys/apiModulePlugin',
    version: '1.0',
};

module.exports = fp(async function (fastify, opts, done) {
    // Instantiate service 
	const userService = new UserService({ fastify });
	const authService = new AuthService(userService, { fastify });
	const mailerService = new MailerService();
	const storageService = new StorageService(path.resolve('public'), { fastify });
	const fileService = new FileService({ fastify });
	const roleService = new RoleService({ fastify });

	// Instantiate validator
	const userValidator = new UserValidator({ fastify });
	const authValidator = new AuthValidator({ fastify });
	const uploadValidator = new UploadValidator({ fastify });
	const roleValidator = new RoleValidator({ fastify });

	// Registering user plugin
	await fastify.register(userPlugin, {
		service: userService,
		storageService,
		validator: userValidator,
	});
	
	// Registering auth plugin
	await fastify.register(authPlugin, {
		service: authService,
		mailerService,
		storageService,
		validator: authValidator,
	});
	
	// Registering upload plugin
	await fastify.register(uploadPlugin, {
		service: storageService,
		fileService,
		validator: uploadValidator,
	});

	// Registering role plugin
	await fastify.register(rolePlugin, {
		service: roleService,
		validator: roleValidator,
	});

    done();
}, meta);
const fastify = require('fastify');
const path = require('path');

/**
 * Config
 */
const corsConfig = require('./config/cors');
const viewConfig = require('./config/view');
const rateLimitConfig = require('./config/rate-limiter');

/**
 * External plugin
 */
const cors = require('@fastify/cors');
const auth = require('@fastify/auth');
const view = require('@fastify/view');
const rateLimit = require('@fastify/rate-limit');

/**
 * Internal & Custom plugin
 */
const i18next = require('./lib/i18next');
const serviceManager = require('./lib/service-manager');
const moduleManager = require('./lib/module-manager');
const staticFile = require('./lib/static-file');
const objection = require('./lib/objection');
const response = require('./lib/response');
const jwtStrategy = require('./lib/jwt');
const upload = require('./lib/upload');
const joi = require('./lib/joi');

/**
 * Hooks
 */
const viewHooks = require('./hooks/viewHooks');
const switchLangHooks = require('./hooks/switchLangHooks');

const App = async (opts = {}) => {
	const app = fastify(opts);

	// External & custom plugin
	await app.register(i18next);
	await app.register(response);
	await app.register(objection);
	await app.register(staticFile);
	await app.register(upload);
	await app.register(cors, corsConfig);
	await app.register(auth);
	await app.register(jwtStrategy);
	await app.register(rateLimit, rateLimitConfig.default);
	await app.register(joi);
	await app.register(view, {
		...viewConfig.compiler,
		defaultContext: { _t: app.Lang.t },
	});
	
	// Core plugin
	await app.register(serviceManager);
	await app.register(moduleManager);

	// Hooks plugin
	await app.register(viewHooks);
	await app.register(switchLangHooks);

	return app;
}

module.exports = App;
const fp = require('fastify-plugin');
const app = require('../config/app');

function hooks(fastify, opts = {}, done) {
	fastify.addHook('onRequest', (request, reply, next) => {
        // Change language on incomming request
        const lang = request.query.lng || request.headers['accept-language'] || app.locale;
        fastify.Lang.locale.changeLanguage(lang);

        // Add global vars to request property
        request.vars = {
            lang,
            ...request.vars,
        };

        next();
    });

	done();
}

module.exports = fp(hooks, {
	name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/lang-hooks`,
	version: '1.0',
});
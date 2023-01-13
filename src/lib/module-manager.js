const fp = require('fastify-plugin');

function moduleManager(fastify, opts, done) {
    // Register all module here from dir: ./module
    // fastify.register('modul');

    done();
}

module.exports = fp(moduleManager, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/module-manager`,
    version: '1.0',
});
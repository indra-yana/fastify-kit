const fp = require('fastify-plugin');
const authModule = require('../module/auth');
const userModule = require('../module/user');
const roleModule = require('../module/role');

function moduleManager(fastify, opts, done) {
    // Register all module here from dir: ./module
    fastify.register(authModule);
    fastify.register(userModule);
    fastify.register(roleModule);

    done();
}

module.exports = fp(moduleManager, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/module-manager`,
    version: '1.0',
});
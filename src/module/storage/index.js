const fp = require('fastify-plugin');

async function storageModule(fastify, opts, done) {
    done();
}

module.exports = fp(storageModule, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/storage-module`,
    version: '1.0',
});
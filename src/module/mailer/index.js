const fp = require('fastify-plugin');

async function mailerModule(fastify, opts, done) {
    done();
}

module.exports = fp(mailerModule, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/mailer-module`,
    version: '1.0',
});
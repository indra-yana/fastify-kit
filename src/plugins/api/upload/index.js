const fp = require('fastify-plugin');
const UploadHandler = require('./handler');
const routes = require('./routes');

const meta = {
    name: '@compsys/uploadPlugin',
    version: '1.0',
};

module.exports = fp(function (fastify, opts, done) {
    const { service, fileService, validator } = opts;
    const uploadHandler = new UploadHandler(service, fileService, validator);

    routes(fastify, { handler: uploadHandler, meta }).forEach((route) => {
        fastify.route(route);
    });
    
    done();
}, meta);
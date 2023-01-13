const fp = require('fastify-plugin');
const AuthService = require('../module/auth/service/AuthService');

function serviceManager(fastify, opts = {}, done) {
    // Register all service here from dir: ./module/module-name/service
    const services = {
        auth: new AuthService(),
    };

    const ServiceManager = {
        add: (name, service) => {
            services[name] = service;
        },
        get: (name) => {
            const service = services[name];
            if (!service) {
                throw new Error(`Service with name "${name}" not defined!`);
            }

            return service;
        },
    };

    fastify.decorate('Service', ServiceManager);
    done();
}

module.exports = fp(serviceManager, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/service-manager`,
    version: '1.0',
});
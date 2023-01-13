const fp = require('fastify-plugin');
const path = require('path');
const ForgotPasswordService = require('../module/auth/service/ForgotPasswordService');
const LoginService = require('../module/auth/service/LoginService');
const RegisterService = require('../module/auth/service/RegisterService');
const VerificationService = require('../module/auth/service/VerificationService');
const MailerService = require('../module/mailer/service/MailerService');
const StorageService = require('../module/storage/service/StorageService');
const UserService = require('../module/user/service/UserService');

function serviceManager(fastify, opts = {}, done) {
    // Register all service here from dir: ./module/module-name/service
    const mailerService = new MailerService();
    const storageService = new StorageService(path.resolve('../public'), { fastify });
    const loginService = new LoginService({ fastify });
    const registerService = new RegisterService({ fastify });
    const forgotPasswordService = new ForgotPasswordService({ fastify });
    const verificationService = new VerificationService({ fastify });
    const userService = new UserService({ fastify });

    const services = {
        mailer: mailerService,
        storage: storageService,
        login: loginService,
        register: registerService,
        forgot: forgotPasswordService,
        verification: verificationService,
        user: userService,
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
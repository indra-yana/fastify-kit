const fp = require('fastify-plugin');
const JoiBase = require('joi');
const id = require('../../../resources/lang/id/translation.json').validation.joi;
const en = require('../../../resources/lang/en/translation.json').validation.joi;
const config = require('../../../config');

const meta = {
    name: '@compsys/joi-fastify',
    version: '1.0',
};

const defaultsOpts = {
    abortEarly: false,
    messages: {
        id,
        en,
    },
    errors: { 
        language: config('app.locale'),
    },
};

module.exports = fp(function (fastify, opts, done) {
    const joiConfig = {
        ...defaultsOpts,
        ...opts,
    };

    const Joi = JoiBase.defaults((schema) => schema.options(joiConfig));

    fastify.decorate('Joi', Joi);
    fastify.locale.on('languageChanged', (lng) => {
        joiConfig.errors.language = lng;
    });

    // [Experimental] change the language config onRequest hook
    // fastify.addHook('onRequest', (request, reply, next) => {
    //     // Change language on incomming request
    //     const lang = request.query.lng || request.headers['accept-language'] || config('app.locale');
    //     joiConfig.errors.language = lang;

    //     next();
    // });

    done();
}, meta);
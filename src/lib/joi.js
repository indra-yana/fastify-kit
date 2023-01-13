const fp = require('fastify-plugin');
const JoiBase = require('joi');
const app = require('../config/app');
const id = require('../../resources/lang/id/translation.json').validation.joi;
const en = require('../../resources/lang/en/translation.json').validation.joi;

const defaultsOpts = {
    abortEarly: false,
    messages: {
        id,
        en,
    },
    errors: {
        language: app.locale,
    },
};

function joi(fastify, opts, done) {
    const joiConfig = {
        ...defaultsOpts,
        ...opts,
    };

    const Joi = JoiBase.defaults((schema) => schema.options(joiConfig));

    fastify.decorate('Joi', Joi);
    fastify.Lang.locale.on('languageChanged', (lng) => {
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
}

module.exports = fp(joi, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/joi`,
    version: '1.0',
});
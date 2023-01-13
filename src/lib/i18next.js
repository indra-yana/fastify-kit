const fp = require('fastify-plugin');
const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const app = require('../config/app');

/**
 * The language detector, will automatically detect the users language, by some criteria, like the query parameter ?lng=en or http header Accept-Language, etc.
 * 
 * backend: you can also use any other i18next backend, like i18next-http-backend or i18next-locize-backend in the backend option
 * initImediate: setting initImediate to false, will load the resources synchronously
 * detection: you can order and decide from where user language should be detected first in the detection option
 */

const defaultsOpts = {
    initImmediate: false,
    fallbackLng: 'en',
    preload: ['en', 'id'],
    backend: {
        loadPath: path.resolve('resources/lang/{{lng}}/{{ns}}.json'),
        // addPath: path.resolve('resources/lang/{{lng}}/{{ns}}.missing.json'),
    },
    detection: {
        order: ['querystring', 'header', 'path', 'session', 'cookie'],
    },
};

function locale(fastify, opts, done) {
    const i18nextConfig = {
        ...defaultsOpts,
        ...opts,
    };

    i18next.use(i18nextMiddleware.LanguageDetector)
        .use(Backend)
        .init(i18nextConfig);

    fastify.register(i18nextMiddleware.plugin, { i18next });

    fastify.decorate('Lang', {
        locale: i18next,
        t: i18next.getFixedT(null, null),
    });

    // fastify.addHook('onRequest', (request, reply, next) => {
    //     // Change language on incomming request
    //     const lang = request.query.lng || request.headers['accept-language'] || app.locale;
    //     fastify.Lang.locale.changeLanguage(lang);

    //     // Add global vars to request property
    //     request.vars = {
    //         lang,
    //         ...request.vars,
    //     };

    //     next();
    // });

    done();
}

module.exports = fp(locale, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/i18n`,
    version: '1.0',
});
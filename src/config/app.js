module.exports = {

    app_name: process.env.APP_NAME || 'Fastify',

    env: process.env.NODE_ENV || 'production',

    debug: process.env.APP_DEBUG || false,

    locale: 'en',

    fallback_locale: 'en',

};
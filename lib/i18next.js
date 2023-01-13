const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');

/**
 * The language detector, will automatically detect the users language, by some criteria, like the query parameter ?lng=en or http header Accept-Language, etc.
 * 
 * backend: you can also use any other i18next backend, like i18next-http-backend or i18next-locize-backend in the backend option
 * initImediate: setting initImediate to false, will load the resources synchronously
 * detection: you can order and decide from where user language should be detected first in the detection option
 * 
 * @Deprecated use ./src/plugins/i18next.js instead
 */
i18next
	.use(i18nextMiddleware.LanguageDetector)
	.use(Backend)   	
	.init({
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
	});

module.exports = { 
	i18next,
	i18nextPlugin: i18nextMiddleware.plugin,
	t: i18next.getFixedT(null, null),
};
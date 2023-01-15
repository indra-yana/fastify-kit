const { html } = require('common-tags');
const { toTitleCase } = require('../../src/utils/utils');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const generateApiModTemplate = (directory, moduleName) => {
	const apiPath = path.join(directory, moduleName, 'api');
	shell.mkdir(apiPath);

	const apiVersionPath = path.join(directory, moduleName, 'api/v1');
	shell.mkdir(apiVersionPath);

	const handlerTemplate = html`
		module.exports = class ${toTitleCase(moduleName)}Handler {
			constructor(${moduleName}Service, validator) {
				this._${moduleName}Service = ${moduleName}Service;
				this._validator = validator; 
			}

			/**
			 * Index handler
			 * 
			 * @param {*} request 
			 * @param {*} reply 
			 * @returns {object}
			 */
			async indexHandler(request, reply) {
				try {
					const { data } = request.body;

					this._validator.validateIndex(data);

					const result = await this._${moduleName}Service.index(data);
					
					return reply.success(({ message: request.t('index.message'), result }));
				} catch (error) {
					return reply.error(error);
				}
			}
		}
	`;

	const indexTemplate = html`
		const ${toTitleCase(moduleName)}Validator = require('../../validator/${toTitleCase(moduleName)}Validator');
		const ${toTitleCase(moduleName)}Handler = require('./handler');
		const routes = require('./routes');
		
		function api(fastify, opts = {}, done) {
			const ${moduleName}Service = fastify.Service.get('${moduleName}');
			const validator = new ${toTitleCase(moduleName)}Validator({ fastify });
		
			const handler = new ${toTitleCase(moduleName)}Handler(${moduleName}Service, validator);
		
			routes(fastify, { handler }).forEach((route) => {
				fastify.route(route);
			});
		
			done();
		}
		
		module.exports = api;
	`;

	const routesTemplate = html`
		const routes = (fastify, { handler }) => [
			{
				method: 'GET',
				url: '/${moduleName}/index',
				preHandler: [],
				handler: async (request, reply) => handler.indexHandler(request, reply),
			},
		];
		
		module.exports = routes;
	`;

	fs.writeFileSync(`${apiVersionPath}\\handler.js`, handlerTemplate);
	fs.writeFileSync(`${apiVersionPath}\\index.js`, indexTemplate);
	fs.writeFileSync(`${apiVersionPath}\\routes.js`, routesTemplate);
}

const generateServiceModTemplate = (directory, moduleName) => {
	const servicePath = path.join(directory, moduleName, 'service');
	shell.mkdir(servicePath);

	const serviceTemplate = html`
		const BaseService = require('../../../lib/BaseService');

		module.exports = class ${toTitleCase(moduleName)}Service extends BaseService {
			constructor({ fastify }) {
				super(fastify);
			}

			/**
			 * Index service
			 * 
			 * @param {*} data 
			 * @returns {object}
			 */
			async index(data) {
				return 'Hello World';
			}
		}
	`;

	fs.writeFileSync(`${servicePath}\\${toTitleCase(moduleName)}Service.js`, serviceTemplate);
}

const generateValidatorModTemplate = (directory, moduleName) => {
	const servicePath = path.join(directory, moduleName, 'validator');
	shell.mkdir(servicePath);

	const validatorTemplate = html`
		const BaseValidator = require('../../../lib/BaseValidator');

		module.exports = class ${toTitleCase(moduleName)}Validator extends BaseValidator {
			constructor({ fastify }) {
				super(fastify);
			}
		
			/**
			 * Validate payloads
			 * 
			 * @param {object} payloads 
			 */
			validateIndex(payloads) {
				const validator = this._Joi.object({
					name: this._Joi.string().required(),
				}).validate(payloads);
				
				this.validationCheck(validator);
			}
		}
	`;

	fs.writeFileSync(`${servicePath}\\${toTitleCase(moduleName)}Validator.js`, validatorTemplate);
}

const generateIndexModTemplate = (directory, moduleName) => {
	const servicePath = path.join(directory, moduleName, '/');
	shell.mkdir(servicePath);

	// eslint-disable-next-line no-template-curly-in-string
	const plugin = "${process.env.PLUGIN_NAME_SPACE || '@app'}";
	const indexTemplate = html`
		const fp = require('fastify-plugin');
		const apiV1 = require('./api/v1');
		
		async function ${moduleName}Module(fastify, opts, done) {
			fastify.register(apiV1, { prefix: '/api/v1' });
		
			done();
		}
		
		module.exports = fp(${moduleName}Module, {
			name: \`${plugin}/${moduleName}-module\`,
			version: '1.0',
		});
	`;

	fs.writeFileSync(`${servicePath}\\index.js`, indexTemplate);
}

module.exports = {
	generateIndexModTemplate,
	generateApiModTemplate,
	generateServiceModTemplate,
	generateValidatorModTemplate,
}
const id = require('../resources/lang/id/translation.json').validation.joi;
const en = require('../resources/lang/en/translation.json').validation.joi;

const Joi = require('joi').defaults((schema) => {
	return schema.options({
		abortEarly: false,
		messages: {
			id,
			en,
		},
	});
});

module.exports = Joi;
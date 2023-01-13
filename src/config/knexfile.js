const path = require('path');
require('dotenv').config({
	path: path.join(__dirname, '../../.env'),
});
const database = require('./database');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	default: {
		client: database.knex.client,
		connection: database.knex.connection,
		migrations: {
			directory: '../../database/migrations',
		},
		seeds: {
			directory: '../../database/seeds',
		},
	},
};
const knex = require('knex');
const database = require('../config/database');

const supportedClients = ['pg', 'sqlite3', 'mysql', 'mysql2', 'oracle', 'mssql'];

function knexConnection(opts = {}) {
    const knexConfig = {
        ...database.knex,
        ...opts,
    };

    if (supportedClients.indexOf(knexConfig.client) === -1) {
        throw new Error(`unsupported client, knex connection only support ${supportedClients.join(', ')}.`);
    }

    return knex(knexConfig);
}

module.exports = knexConnection;
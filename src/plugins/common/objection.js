/* eslint-disable no-param-reassign */
const fp = require('fastify-plugin');
const Knex = require('knex');
const { Model } = require('objection');
const config = require('../../../config');
const File = require('../../../database/models/File');
const Role = require('../../../database/models/Role');
const User = require('../../../database/models/User');

const meta = {
    name: '@compsys/fastify-objectionORM',
    version: '1.0',
};

const defaultKnexConfig = {
    instance: 'objection',
    ...config('database.orm.knek_pg'),
};
  
const supportedClients = ['pg', 'sqlite3', 'mysql', 'mysql2', 'oracle', 'mssql'];

module.exports = fp(function (fastify, opts, done) {
    // Check if the model already defined from opts
    // If not defined, put the actual models here
    if (!opts.model) {
        opts.models = [
            User,
            File,
            Role,
        ];
    }

    const knexConfig = {
        ...defaultKnexConfig,
        ...opts,
    };
    
    if (supportedClients.indexOf(knexConfig.client) === -1) {
        done(new Error(`unsupported client, 'fastify-objectionjs' only support ${supportedClients.join(', ')}.`));
        return;
    }

    const knexConnection = Knex(knexConfig);
    const objection = {
        knex: knexConnection,
    };

    Model.knex(knexConnection);
    if (opts.models) {
        if (!Array.isArray(opts.models) || opts.models.length < 1) {
            done(new Error('You need to provide a valid array of `objection.js` models.'));
            return;
        }
    
        objection.models = {};
        for (let i = 0; i < opts.models.length; i += 1) {
            const model = opts.models[i];
    
            if (model.idColumn && model.tableName && model.QueryBuilder) {
                objection.models[model.name.replace(/^\w/, (c) => c.toLowerCase())] = model;
            }
        }
    
        if (Object.keys(objection.models).length < 1) {
            done(new Error('The supplied models are invalid.'));
            return;
        }
    }

    if (!fastify.objection) {
        fastify.decorate(knexConfig.instance || 'objection', objection);
    } else {
        done(new Error('fastify-objectionjs has already registered.'));
        return;
    }

    fastify.addHook('onClose', (_, next) => {
        knexConnection.destroy();
        next();
    });

    done();
}, meta);
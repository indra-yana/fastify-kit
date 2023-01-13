const fp = require('fastify-plugin');
const knexConnection = require('./knex');
const User = require('../../database/models/User');

function objectionORM(fastify, opts, done) {
    const connection = knexConnection();
    const config = {
        decoratorName: 'objection',
        ...opts,
    };

    // Check if the model already defined from opts
    // If not defined, put the actual models here
    if (!opts.model) {
        opts.models = [
            User,
        ];
    }

    const objection = {
        knex: connection,
        models: opts.models,
    };

    if (objection.models) {
        if (!Array.isArray(objection.models) || objection.models.length < 1) {
            done(new Error('You need to provide a valid array of `objection.js` models.'));
            return;
        }

        objection.models.map((model) => {
            if (model.idColumn && model.tableName && model.QueryBuilder) {
                objection.models[model.name] = model;
            }
            return true;
        });

        if (Object.keys(objection.models).length < 1) {
            done(new Error('The supplied models are invalid.'));
            return;
        }
    }

    const { decoratorName } = config;
    if (!fastify[decoratorName]) {
        fastify.decorate(decoratorName, objection);
    } else {
        done(new Error('fastify-objectionjs has already registered.'));
        return;
    }

    fastify.addHook('onClose', (_, next) => {
        connection.destroy();
        next();
    });

    done();
}

module.exports = fp(objectionORM, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/objection`,
    version: '1.0',
});
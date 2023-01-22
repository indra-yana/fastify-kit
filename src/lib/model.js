const { nanoid } = require('nanoid');
const { Model } = require('objection');
const knexConnection = require('./knex');

Model.knex(knexConnection());

function ObjectionModel() {
    // General model extension
    return class extends Model {
        /**
         * Do something to the model before inserted
         * 
         * @param {*} context 
         */
        $beforeInsert(context) {
            this.id = nanoid(16);
        }

        /**
         * Do something to the model before updated
         * 
         * @param {*} context
         */
        $beforeUpdate(opt, context) {
            this.updated_at = new Date().toISOString();
        }
    };
}

module.exports = ObjectionModel;
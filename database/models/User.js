/* eslint-disable global-require */
const { Model } = require('objection');
const ObjectionModel = require('../../src/lib/model');

class User extends ObjectionModel {
	/**
	 * Table name is the only required property.
	 */
	static tableName = 'users';

	/**
	 * This object defines the relations to other models.
	 */
	static get relationMappings() {
		// Importing models here is one way to avoid require loops.
		const File = require('./File');

		return {
			files: {
				relation: Model.HasManyRelation,
				modelClass: File,
				join: {
					from: 'users.id',
					to: 'files.user_id',
				},
			},
		};
	}
	
}

module.exports = User;
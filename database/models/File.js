/* eslint-disable global-require */
const { Model } = require('objection');
const ObjectionModel = require('../../src/lib/model');

class File extends ObjectionModel {
	/**
	 * Table name is the only required property.
	 */
	static tableName = 'files';

	/**
	 * This object defines the relations to other models.
	 */
	static get relationMappings() {
		// Importing models here is one way to avoid require loops.
		const User = require('./User');

		return {
			user: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'files.user_id',
					to: 'users.id',
				},
			},
		};
	}
}

module.exports = File;
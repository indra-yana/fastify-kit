/* eslint-disable global-require */
const { Model } = require('objection');
const ObjectionModel = require('../../src/lib/model');

class Role extends ObjectionModel() {
	/**
	 * Table name is the only required property.
	 */
	static tableName = 'roles';

}

module.exports = Role;
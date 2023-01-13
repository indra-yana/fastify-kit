const { mapRoleFormat, joiValidationFormat } = require('../../utils/utils');
const BaseService = require('../BaseService');
const InvariantException = require('../../exceptions/InvariantException');
const NotFoundException = require('../../exceptions/NotFoundException');
const ValidationException = require('../../exceptions/ValidationException');
const QueryException = require('../../exceptions/QueryException');

class RoleService extends BaseService {

    constructor({ fastify }) {
        super(fastify);

        ({ role: this._role } = this._fastify.objection.models);
    }

    /**
     * Create new data
     * 
     * @param {*} data 
     * @returns {object}
     */
    async create(data) {
        const tags = ['RoleService', '@create'];
        const { name } = data;
        
        await this.checkIfRoleExists('name', name);
        
        const newData = { name };
        const result = await this._role.query()
                                .insert(newData)
                                .returning('*')
                                .catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result) {
            throw new InvariantException({ message: this._t('message.created_fail'), tags });
        }

        return mapRoleFormat(result);
    }

    /**
     * Update existing data
     * 
     * @param {string} id 
     * @param {*} data 
     * @returns {object}
     */
    async update(id, data) {
        const tags = ['RoleService', '@update'];
        const { name } = data;

        await this.show(id);
        await this.checkUniqueField('name', { id, value: name });

        const updatedData = { name };
        const result = await this._role.query()
                                .findById(id)
                                .patch(updatedData)
                                .returning('*')
                                .catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapRoleFormat(result);
    }
    
    /**
     * Get collection of data
     * 
     * @returns {object}
     */
    async roles() {
        const result = await this._role.query();

        return result.map(mapRoleFormat);
    }

    /**
     * Show specific data by id
     * 
     * @param {string} id 
     * @param {boolean} useFormater 
     * @returns {object}
     */
    async show(id, useFormater = true) {
        const tags = ['RoleService', '@show'];
        const result = await this._role.query().findById(id);

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return useFormater ? mapRoleFormat(result) : result;
    }
    
    /**
     * Show specific data by key
     * 
     * @param {string} key 
     * @param {*} value 
     * @returns {object}
     */
    async showByKey(key, value, useFormater = true) {
        const tags = ['RoleService', '@showByKey'];
        const result = await this._role.query().findOne(key, value);

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return useFormater ? mapRoleFormat(result) : result;
    }
    
    /**
     * Show details data of the roles
     * You may use join with other table relation here
     * 
     * @param {string} id 
     * @returns {object}
     */
    async details(id) {
        const tags = ['RoleService', '@details'];
        const result = await this._role.query().findById(id);

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapRoleFormat(result);
    }

    /**
     * Delete an existing data using id
     * 
     * @param {string} id 
     */
    async delete(id) {
        const tags = ['RoleService', '@delete'];
        const result = await this._role.query()
                                .deleteById(id)
                                .returning('id');

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return result.id;
    }
    
    /**
     * Check if username or email already been exist
     * 
     * @param {string} field 
     * @param {*} value 
     */
    async checkIfRoleExists(field = 'name', value = null) {
        const tags = ['RoleService', '@checkIfRoleExists'];
        const result = await this._role.query()
                                .select('name')
                                .where(field, value)
                                .returning('*');

        if (result.length > 0) {
            throw new ValidationException({ 
                message: this._t('message.validation_fail'), 
                error: joiValidationFormat([
                    {
                        path: [field],
                        message: this._t('validation.unique', { attribute: field }),
                    },
                ]),
                tags,
            });
        }
    }

    /**
     * Check if user can be updated
     * 
     * @param {string} field 
     * @param {*} value 
     */
    async checkUniqueField(field = 'name', data = {}) {
        const tags = ['RoleService', '@checkUniqueField'];
        const result = await this._role.query()
                                .select('name')
                                .where(field, data.value)
                                .whereNot('id', data.id)
                                .returning('*');

        if (result.length > 0) {
            throw new ValidationException({ 
                message: this._t('message.validation_fail'), 
                error: joiValidationFormat([
                    {
                        path: [field],
                        message: this._t('validation.unique', { attribute: field }),
                    },
                ]),
                tags,
            });
        }
    }

}

module.exports = RoleService;
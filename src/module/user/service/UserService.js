const { mapUserFormat, joiValidationFormat } = require('../../../utils/utils');
const BaseService = require('../../../lib/BaseService');
const bcrypt = require('bcrypt');
const InvariantException = require('../../../exceptions/InvariantException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const QueryException = require('../../../exceptions/QueryException');

module.exports = class UserService extends BaseService {

    constructor({ fastify }) {
        super(fastify);

        this._User = fastify.objection.models.User;
    }

    /**
     * Create new data
     * 
     * @param {*} data 
     * @returns {object}
     */
    async create(data) {
        const tags = ['UserService', '@create'];
        const { name, username, email, password, avatar = {} } = data;

        await this.checkIfUsernameOrEmailExists('username', username);
        await this.checkIfUsernameOrEmailExists('email', email);

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            username,
            email,
            avatar: Object.keys(avatar).length !== 0 ? avatar : null,
            password: hashedPassword,
        };

        const result = await this._User.query()
            .insert(newUser)
            .returning('*')
            .catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result) {
            throw new InvariantException({ message: this._t('message.created_fail'), tags });
        }

        return mapUserFormat(result);
    }

    /**
     * Update existing data
     * 
     * @param {string} id 
     * @param {*} data 
     * @returns {object}
     */
    async update(id, data) {
        const tags = ['UserService', '@update'];
        const { name, username, email, avatar = {} } = data;

        await this.show(id);
        await this.checkUniqueField('username', { id, value: username });
        await this.checkUniqueField('email', { id, value: email });

        const updatedUser = {
            name,
            username,
            email,
            avatar: Object.keys(avatar).length !== 0 ? avatar : null,
        };

        const result = await this._User.query()
            .findById(id)
            .patch(updatedUser)
            .returning('*')
            .catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result);
    }

    /**
     * Update user avatar 
     * 
     * @param {string} id 
     * @param {*} data 
     * @returns {object}
     */
    async updateAvatar(id, fileName) {
        const updatedUser = {
            avatar: fileName,
        };

        const result = await this._User.query()
            .findById(id)
            .patch(updatedUser)
            .returning('avatar');

        return result.avatar;
    }

    /**
     * Get collection of data
     * 
     * @returns {object}
     */
    async users() {
        const result = await this._User.query();

        return result.map(mapUserFormat);
    }

    /**
     * Show specific data by id
     * 
     * @param {string} id 
     * @param {boolean} useFormater 
     * @returns {object}
     */
    async show(id, useFormater = true) {
        const tags = ['UserService', '@show'];
        const result = await this._User.query().findById(id);

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return useFormater ? mapUserFormat(result) : result;
    }

    /**
     * Show specific data by key
     * 
     * @param {string} key 
     * @param {*} value 
     * @returns {object}
     */
    async showByKey(key, value, useFormater = true) {
        const tags = ['UserService', '@showByKey'];
        const result = await this._User.query().findOne(key, value);

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return useFormater ? mapUserFormat(result) : result;
    }

    /**
     * Show details data of user
     * You may use join with other table relation here
     * 
     * @param {string} id 
     * @returns {object}
     */
    async details(id) {
        const tags = ['UserService', '@details'];
        const result = await this._User.query().findById(id);

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result);
    }

    /**
     * Delete an existing data using id
     * 
     * @param {string} id 
     */
    async delete(id) {
        const tags = ['UserService', '@delete'];
        const result = await this._User.query()
            .deleteById(id)
            .returning('id');

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return result.id;
    }

}
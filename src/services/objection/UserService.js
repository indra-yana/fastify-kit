const { mapUserFormat, joiValidationFormat } = require('../../utils/utils');
const bcrypt = require('bcrypt');
const BaseService = require('../BaseService');
const InvariantException = require('../../exceptions/InvariantException');
const NotFoundException = require('../../exceptions/NotFoundException');
const AuthenticationException = require('../../exceptions/AuthenticationException');
const ValidationException = require('../../exceptions/ValidationException');
const QueryException = require('../../exceptions/QueryException');

class UserService extends BaseService {

    constructor({ fastify }) {
        super(fastify);

        this._users = [];
        ({ user: this._user } = this._fastify.objection.models);
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

        const result = await this._user.query()
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

        const result = await this._user.query()
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

        const result = await this._user.query()
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
        const result = await this._user.query();

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
        const result = await this._user.query().findById(id);

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
        const result = await this._user.query().findOne(key, value);

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
        const result = await this._user.query().findById(id);

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
        const result = await this._user.query()
                                .deleteById(id)
                                .returning('id');

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return result.id;
    }

    /**
     * Verify user credential
     * 
     * @param {*} credentials 
     * @returns {boolean}
     */
    async credentials(credentials) {
        const tags = ['UserService', '@credentials'];
        const { password } = credentials;

        delete credentials.password;

        const result = await this._user.query().findOne(credentials);

        if (!result) {
            throw new ValidationException({ 
                message: this._t('auth.login_failed'), 
                error: joiValidationFormat([
                    {
                        path: ['credential'],
                        message: this._t('auth.failed'),
                    },
                ]),
                tags,
            });
        }
        
        const { password: hashedPassword } = result;
        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) {
            throw new ValidationException({ 
                message: this._t('auth.login_failed'),
                error: joiValidationFormat([
                    {
                        path: ['password'],
                        message: this._t('auth.password'),
                    },
                ]), 
                tags, 
            });
        }

        return mapUserFormat(result);
    }

    /**
     * Reset password
     * 
     * @param {string} id  
     * @param {string} password 
     * @returns {object}
     */
    async resetPassword(id, password) {
        await this.show(id, false);
        
        const tags = ['UserService', '@resetPassword'];
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await this._user.query()
                                .findById(id)
                                .patch({ password: hashedPassword })
                                .returning('*');

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result);
    }

    /**
     * Password confirmation
     * 
     * @param {string} id  
     * @param {string} password 
     * @returns {boolean}
     */
    async confirmPassword(id, password) {
        const tags = ['UserService', '@confirmPassword'];
        const user = await this.show(id, false);
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new AuthenticationException({ 
                message: this._t('password.incorrect'), 
                error: joiValidationFormat([
                    {
                        path: ['password'],
                        message: this._t('auth.password'),
                    },
                ]),
                tags,
            });
        }
    }

    /**
     * Verification email address
     * 
     * @param {string} id 
     * @returns {object}
     */
    async verify(id) {
        await this.show(id, false);

        const tags = ['UserService', '@verify'];
        const updatedAt = new Date().toISOString();
        const result = await this._user.query()
                                .findById(id)
                                .patch({ email_verified_at: updatedAt })
                                .returning('*');

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result);
    }
    
    /**
     * Check if username or email already been exist
     * 
     * @param {string} field 
     * @param {*} value 
     */
    async checkIfUsernameOrEmailExists(field = 'email', value = null) {
        const tags = ['UserService', '@checkIfUsernameOrEmailExists'];
        const result = await this._user.query()
                                .select('username', 'email')
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
    async checkUniqueField(field = 'email', data = {}) {
        const tags = ['UserService', '@checkUniqueField'];
        const result = await this._user.query()
                                .select('username', 'email')
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

module.exports = UserService;
const { nanoid } = require('nanoid');
const { mapUserFormat, joiValidationFormat } = require('../../utils/utils');
const bcrypt = require('bcrypt');
const InvariantException = require('../../exceptions/InvariantException');
const NotFoundException = require('../../exceptions/NotFoundException');
const AuthenticationException = require('../../exceptions/AuthenticationException');
const ValidationException = require('../../exceptions/ValidationException');
const BaseService = require('../BaseService');

class UserService extends BaseService {

    constructor({ fastify }) {
        super(fastify);

        this._users = [];
    }

    /**
     * Create new data
     * 
     * @param {*} data 
     * @returns {object}
     */
    async create(data) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = {
            id,
            name: data.name,
            username: data.username,
            email: data.email,
            password: hashedPassword,
            created_at: createdAt, 
            updated_at: updatedAt, 
        };

        this._users.push(newUser);

        const isSuccess = this._users.filter((user) => user.id === id).length > 0;
        if (!isSuccess) {
            throw new InvariantException({ message: this._t('message.created_fail'), tags: ['UserService', '@create'] });
        }

        return mapUserFormat(newUser);
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
        const index = this._users.findIndex((user) => user.id === id);
        if (index === -1) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        const updatedAt = new Date().toISOString();
        this._users[index] = {
            ...this._users[index],
            name: data.name,
            username: data.username,
            updated_at: updatedAt, 
        };

        return mapUserFormat(this._users[index]);
    }
    
    /**
     * Get collection of data
     * 
     * @returns {object}
     */
    async users() {
        return this._users.map(mapUserFormat);
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
        const user = this._users.filter((value) => value.id === id)[0];
        if (!user) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return useFormater ? mapUserFormat(user) : user;
    }
    
    /**
     * Show specific data by key
     * 
     * @param {string} key 
     * @param {*} value 
     * @returns {object}
     */
    async showByKey(key, value) {
        const tags = ['UserService', '@showByKey'];
        const user = this._users.filter((item) => (item[key] ?? '') === value)[0];
        if (!user) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(user);
    }
    
    /**
     * Show details data of user
     * 
     * @param {string} id 
     * @returns {object}
     */
    async details(id) {
        const tags = ['UserService', '@details'];
        const user = this._users.filter((value) => value.id === id)[0];
        if (!user) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(user);
    }

    /**
     * Delete an existing data using id
     * 
     * @param {string} id 
     */
    async delete(id) {
        const tags = ['UserService', '@delete'];
        const index = this._users.findIndex((user) => user.id === id);
        if (index === -1) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        this._users.splice(index, 1);
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
        const field = credentials.hasOwnProperty('username') ? 'username' : 'email';

        const user = this._users.filter((value) => value[field] === credentials[field])[0];
        if (!user) {
            throw new ValidationException({ 
                message: this._t('auth.login_failed'), 
                error: joiValidationFormat([
                    {
                        path: ['email'],
                        message: this._t('auth.failed'),
                    },
                ]),
                tags,
            });
        }
        
        const match = await bcrypt.compare(password, user.password);
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

        return mapUserFormat(user);
    }

    /**
     * Reset password
     * 
     * @param {string} id  
     * @param {string} password 
     * @returns {object}
     */
    async resetPassword(id, password) {
        const tags = ['UserService', '@resetPassword'];
        const index = this._users.findIndex((user) => user.id === id);
        if (index === -1) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedAt = new Date().toISOString();
        this._users[index] = {
            ...this._users[index],
            password: hashedPassword,
            updated_at: updatedAt, 
        };

        return mapUserFormat(this._users[index]);
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
        const tags = ['UserService', '@resetPassword'];
        const index = this._users.findIndex((user) => user.id === id);
        if (index === -1) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        const updatedAt = new Date().toISOString();
        this._users[index] = {
            ...this._users[index],
            email_verified_at: updatedAt,
            updated_at: updatedAt, 
        };

        return mapUserFormat(this._users[index]);
    }

}

module.exports = UserService;
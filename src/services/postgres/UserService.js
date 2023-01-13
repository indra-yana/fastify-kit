const { nanoid } = require('nanoid');
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
        this._pool = this._fastify.pg;
    }

    /**
     * Create new data
     * 
     * @param {*} data 
     * @returns {object}
     */
    async create(data) {
        const tags = ['UserService', '@create'];
        const { name, username, email, password } = data;
        
        await this.checkIfUsernameOrEmailExists('username', username);
        await this.checkIfUsernameOrEmailExists('email', email);
        
        const id = nanoid(16);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await this._pool.query({
            text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING *',
            values: [id, name, username, email, hashedPassword],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantException({ message: this._t('message.created_fail'), tags });
        }

        return mapUserFormat(result.rows[0]);
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
        const updatedAt = new Date().toISOString();
        const { name, username } = data;

        await this.checkUniqueField('username', { id, value: username });

        const result = await this._pool.query({
            text: 'UPDATE users SET name = $1, username = $2, updated_at = $3 WHERE id = $4 RETURNING *',
            values: [name, username, updatedAt, id],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result.rows[0]);
    }
    
    /**
     * Get collection of data
     * 
     * @returns {object}
     */
    async users() {
        const result = await this._pool.query({
            text: 'SELECT * FROM users',
        }).catch((error) => ({ error }));

        return result.rows.map(mapUserFormat);
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
        const result = await this._pool.query({
            text: 'SELECT * FROM users WHERE id = $1',
            values: [id],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return useFormater ? mapUserFormat(result.rows[0]) : result.rows[0];
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
        const result = await this._pool.query({
            text: `SELECT * FROM users WHERE ${key} = $1`,
            values: [value],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return useFormater ? mapUserFormat(result.rows[0]) : result.rows[0];
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
        const result = await this._pool.query({
            text: 'SELECT * FROM users WHERE id = $1',
            values: [id],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return result.rows.map(mapUserFormat)[0];
    }

    /**
     * Delete an existing data using id
     * 
     * @param {string} id 
     */
    async delete(id) {
        const tags = ['UserService', '@delete'];
        const result = await this._pool.query({
            text: 'DELETE FROM users WHERE id = $1 RETURNING id',
            values: [id],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return result.rows[0].id;
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

        const result = await this._pool.query({
            text: `SELECT * FROM users WHERE ${field} = $1`,
            values: [credentials[field]],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
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
        
        const { password: hashedPassword } = result.rows[0];
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

        return result.rows.map(mapUserFormat)[0];
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
        const updatedAt = new Date().toISOString();
        const result = await this._pool.query({
            text: 'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3 RETURNING *',
            values: [hashedPassword, updatedAt, id],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result.rows[0]);
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
        const result = await this._pool.query({
            text: 'UPDATE users SET email_verified_at = $1, updated_at = $1 WHERE id = $2 RETURNING *',
            values: [updatedAt, id],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result.rows[0]);
    }
    
    /**
     * Check if username or email already been exist
     * 
     * @param {string} field 
     * @param {*} value 
     */
    async checkIfUsernameOrEmailExists(field = 'email', value = null) {
        const tags = ['UserService', '@checkIfUsernameOrEmailExists'];
        const result = await this._pool.query({
            text: `SELECT username, email FROM users WHERE ${field} = $1`,
            values: [value],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (result.rowCount > 0) {
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
        const result = await this._pool.query({
            text: `SELECT username, email FROM users WHERE ${field} = $1 AND id <> $2`,
            values: [data.value, data.id],
        }).catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (result.rowCount > 0) {
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
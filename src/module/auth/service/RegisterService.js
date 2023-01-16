const { generateToken } = require('../../../lib/tokenize');
const { joiValidationFormat, mapUserFormat } = require('../../../utils/utils');
const BaseService = require('../../../lib/BaseService');
const bcrypt = require('bcrypt');
const InvariantException = require('../../../exceptions/InvariantException');
const QueryException = require('../../../exceptions/QueryException');
const ValidationException = require('../../../exceptions/ValidationException');

module.exports = class RegisterService extends BaseService {

    constructor({ fastify }) {
        super(fastify);
        this._jwt = fastify.jwt;
        this._User = fastify.objection.models.User;
    }

    /**
     * Authenticated user 
     * 
     * @param {*} data 
     * @returns {string}
     */
    async register(data) {
        const tags = ['RegisterService', '@register'];
        const { name, username, email, password, avatar = null } = data;

        await this.checkIfUsernameOrEmailExists('username', username);
        await this.checkIfUsernameOrEmailExists('email', email);

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            username,
            email,
            // avatar,
            password: hashedPassword,
        };

        const result = await this._User.query()
            .insert(newUser)
            .catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result) {
            throw new InvariantException({ message: this._t('message.created_fail'), tags });
        }

        const user = mapUserFormat(result);
        const token = generateToken(this._jwt, user);

        return {
            user,
            ...token,
        };
    }

    /**
     * Check if username or email already been exist
     * 
     * @param {string} field 
     * @param {*} value 
     */
    async checkIfUsernameOrEmailExists(field = 'email', value = null) {
        const tags = ['RegisterService', '@checkIfUsernameOrEmailExists'];
        const result = await this._User.query()
            .select('username', 'email')
            .where(field, value);

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
     * Update user avatar 
     * 
     * @param {*} id 
     * @param {*} fileName 
     * @returns {string}
     */
    async updateAvatar(id, fileName) {
        const updatedUser = {
            avatar: fileName,
        };

        const result = await this._User.query()
            .findById(id)
            .patch(updatedUser);

        return result.avatar;
    }

}
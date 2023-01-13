const { generateToken } = require('../../../lib/tokenize');
const { joiValidationFormat, mapUserFormat } = require('../../../utils/utils');
const { validateEmail } = require('filter-validate-email');
const AuthenticationException = require('../../../exceptions/AuthenticationException');
const BaseService = require('../../../lib/BaseService');
const bcrypt = require('bcrypt');
const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');

module.exports = class LoginService extends BaseService {

    constructor({ fastify }) {
        super(fastify);
        this._jwt = fastify.jwt;
        this._User = fastify.objection.models.User;
    }

    /**
     * Choose the login credential to use email or username 
     * to be used by the models query.
     *
     * @param {*} value 
     * @return {string}
     */
    credentialField(value) {
        return validateEmail(value, false) ? 'email' : 'username';
    }

    /**
     * Get the needed authorization credentials from the input.
     *
     * @param {*} credential 
     * @param {*} password 
     * @return {object}
     */
    getCredentials(credential, password) {
        return {
            [this.credentialField(credential)]: credential,
            password,
        };
    }

    /**
     * Authenticated user 
     * 
     * @param {*} data 
     * @returns {string}
     */
    async login(data) {
        const tags = ['LoginService', '@login'];
        const { credential, password, remember = false } = data;
        const credentials = this.getCredentials(credential, password);

        delete credentials.password;
        const result = await this._User.query().findOne(credentials);
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

        const user = mapUserFormat(result);
        const token = generateToken(this._jwt, user);

        return {
            user,
            ...token,
        };
    }

    /**
     * Check who is login and return details data 
     * 
     * @param {*} token 
     * @returns {object}
     */
    async whoami(token) {
        const tags = ['LoginService', '@whoami'];
        const decodedToken = await this._jwt.decode(token);
        const { id } = decodedToken;

        const result = await this._User.query().findById(id);
        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result);
    }

    /**
     * Check and generate new refresh token 
     *
     * @param {*} token 
     * @return {string}
     */
    async refreshToken(token) {
        const tags = ['LoginService', '@refreshToken'];
        const decodedToken = this._jwt.verify(token);
        const { id } = decodedToken;

        const result = await this._User.query().findById(id);
        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        const user = mapUserFormat(result);

        return generateToken(this._jwt, user);
    }

    /**
     * Password confirmation
     * 
     * @param {*} id 
     * @param {*} password 
     * @returns {void}
     */
    async confirmPassword(id, password) {
        const tags = ['LoginService', '@confirmPassword'];
        const user = await this._User.query().findById(id);
        if (!user) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

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

}
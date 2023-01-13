const { createToken, joiValidationFormat } = require('../../../utils/utils');
const { validateEmail } = require('filter-validate-email');
const authConfig = require('../../../config/auth');
const BaseService = require('../../../lib/BaseService');
const ValidationException = require('../../../exceptions/ValidationException');

class AuthService extends BaseService {

    constructor(userService, { fastify }) {
        super(fastify);
        this._jwt = fastify.jwt;
        this._userService = userService;

        this.LINK_EXPIRE_MINUTES = 25;  // 25 Minutes
        this.ACCESS_TOKEN_OPTS = authConfig.jwt.access_token;
        this.REFRESH_TOKEN_OPTS = authConfig.jwt.refresh_token;
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
        const credentialField = {};
        credentialField[this.credentialField(credential)] = credential;

        return {
            ...credentialField, 
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
        const { credential, password, remember = false } = data;
        const user = await this._userService.credentials(this.getCredentials(credential, password));
        
        return { 
            user, 
            token: { 
                accessToken: this._jwt.sign(user, this.ACCESS_TOKEN_OPTS), 
                refreshToken: this._jwt.sign({ id: user.id }, this.REFRESH_TOKEN_OPTS),
            },
        };
    }

    /**
     * Authenticated user 
     * 
     * @param {*} data 
     * @returns {string}
     */
    async register(data) {
        const user = await this._userService.create(data);

        return { 
            user, 
            token: { 
                accessToken: this._jwt.sign(user, this.ACCESS_TOKEN_OPTS), 
                refreshToken: this._jwt.sign({ id: user.id }, this.REFRESH_TOKEN_OPTS),
            },
        };
    }

    /**
     * Update user avatar 
     * 
     * @param {*} data 
     * @returns {string}
     */
    async updateAvatar(id, fileName) {
        const avatar = await this._userService.updateAvatar(id, fileName);
        return avatar;
    }

    /**
     * Decode the jwt token 
     * 
     * @param {*} data 
     * @returns {object}
     */
    async decodeToken(token) {
        const decodedToken = this._jwt.decode(token);
        
        return decodedToken;
    }

    /**
     * Check who is login and return details data 
     * 
     * @param {*} token 
     * @returns {object}
     */
    async whoami(token) {
        const decodedToken = await this.decodeToken(token);
        const { id } = decodedToken;
        
        const result = await this._userService.details(id);

        return result;
    }

    /**
     * Send reset link email
     * 
     * @param {string} email 
     * @returns {object}
     */
    async sendResetLink(email) {
        const user = await this._userService.showByKey('email', email);
        
        const encodedEmail = encodeURIComponent(email);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + this.LINK_EXPIRE_MINUTES);
        const expiresMs = expires.getTime();

        // TODO: Save the token to database
        const token = `${expiresMs}#${createToken(email, expiresMs)}`;
        const encodedToken = encodeURIComponent(token);
        const link = `${process.env.APP_RESET_URL}/${encodedToken}?email=${encodedEmail}`;

        return { user, link };
    }

    /**
     * Reset the password 
     * 
     * @param {*} data 
     * @returns {object}
     */
    async resetPassword(data) {
        const { email, password, token } = data;
        const tags = ['AuthService', '@resetPassword'];

        // TODO: Check token from database for comparison
        // Determine if the token matches with specified email and expires timestamp.
        const tokenPart = token.split('#');
        const expires = tokenPart[0];
        const matches = tokenPart[1] === createToken(email, expires);

        if (!matches) {
            throw new ValidationException({ 
                message: this._t('password.token'), 
                error: joiValidationFormat([
                    {
                        path: ['email'],
                        message: this._t('password.token'),
                    },
                ]),
                tags,
            });
        }

        if (Date.now() > expires) {
            throw new ValidationException({ 
                message: this._t('password.expired'), 
                error: joiValidationFormat([
                    {
                        path: ['email'],
                        message: this._t('password.expired'),
                    },
                ]),
                tags,
            });
        }

        const user = await this._userService.showByKey('email', email);
        await this._userService.resetPassword(user.id, password);

        // TODO: delete token from database if password reset has ben successfully 
    }

    /**
     * Password confirmation
     * 
     * @param {*} data 
     * @returns {void}
     */
    async confirmPassword(id, password) {
        await this._userService.confirmPassword(id, password);
    }

    /**
     * Send email verification link 
     * 
     * @param {string} email 
     * @returns {object}
     */
    async resendVerification(email) {
        const user = await this._userService.showByKey('email', email);
        if (user.emailVerifiedAt !== null) {
            return { user };
        }

        const encodedEmail = encodeURIComponent(email);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + this.LINK_EXPIRE_MINUTES);
        const expiresMs = expires.getTime();

        // TODO: Save the token to database
        const token = `${expiresMs}#${createToken(email, expiresMs)}`;
        const encodedToken = encodeURIComponent(token);
        const link = `${process.env.APP_VERIFY_URL}/${encodedToken}?email=${encodedEmail}`;

        return { user, link };
    }

    /**
     * Verify the user account
     * 
     * @param {*} data 
     * @returns {object}
     */
    async verify(data) {
        const { email, token } = data;
        const tags = ['AuthService', '@verify'];

        // TODO: Check token from database for comparison
        // Determine if the token matches with specified email and expires timestamp.
        const tokenPart = token.split('#');
        const expires = tokenPart[0];
        const matches = tokenPart[1] === createToken(email, expires);

        if (!matches) {
            throw new ValidationException({ 
                message: this._t('verify.token'), 
                error: joiValidationFormat([
                    {
                        path: ['email'],
                        message: this._t('verify.token'),
                    },
                ]),
                tags,
            });
        }

        if (Date.now() > expires) {
            throw new ValidationException({ 
                message: this._t('verify.expired'), 
                error: joiValidationFormat([
                    {
                        path: ['email'],
                        message: this._t('verify.expired'),
                    },
                ]),
                tags,
            });
        }

        let user = await this._userService.showByKey('email', email);
        user = await this._userService.verify(user.id);

        return user;
    }

    /**
     * Check and generate new refresh token 
     *
     * @param {*} token 
     * @return {string}
     */
    async refreshToken(token) {
        const decodedToken = this._jwt.verify(token);
        const { id } = decodedToken;

        const user = await this._userService.show(id);

        // TODO: check the refreshToken from database
        const accessToken = this._jwt.sign(user, this.ACCESS_TOKEN_OPTS);
        const refreshToken = this._jwt.sign({ id: user.id }, this.REFRESH_TOKEN_OPTS);
        
        return { token: { accessToken, refreshToken } };
    }
}

module.exports = AuthService;
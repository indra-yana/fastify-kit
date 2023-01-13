const { createToken, joiValidationFormat, mapUserFormat } = require('../../../utils/utils');
const BaseService = require('../../../lib/BaseService');
const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');
const bcrypt = require('bcrypt');

module.exports = class ForgotPasswordService extends BaseService {

    constructor({ fastify }) {
        super(fastify);
        this._User = fastify.objection.models.User;

        this.LINK_EXPIRE_MINUTES = 60;  // 60 Minutes
    }

    /**
     * Send reset link email
     * 
     * @param {string} email 
     * @returns {object}
     */
    async sendResetLink(email) {
        const tags = ['ForgotPasswordService', '@sendResetLink'];
        const result = await this._User.query().findOne('email', email);
        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }
    
        const encodedEmail = encodeURIComponent(email);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + this.LINK_EXPIRE_MINUTES);
        const expiresMs = expires.getTime();

        // TODO: Save the token to database
        const token = `${expiresMs}#${createToken(email, expiresMs)}`;
        const encodedToken = encodeURIComponent(token);
        const link = `${process.env.APP_RESET_URL}/${encodedToken}?email=${encodedEmail}`;

        return { 
            user: mapUserFormat(result), 
            link,
        };
    }

    /**
     * Reset the password 
     * 
     * @param {*} data 
     * @returns {object}
     */
    async resetPassword(data) {
        const { email, password, token } = data;
        const tags = ['ForgotPasswordService', '@resetPassword'];

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

        const user = await this._User.query().findOne('email', email);
        if (!user) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await this._User.query()
                        .findById(user.id)
                        .patch({ password: hashedPassword })

        // TODO: delete token from database if password reset has ben successfully 
    }

}
const { createToken, joiValidationFormat, mapUserFormat } = require('../../../utils/utils');
const BaseService = require('../../../lib/BaseService');
const NotFoundException = require('../../../exceptions/NotFoundException');
const ValidationException = require('../../../exceptions/ValidationException');

module.exports = class VerificationService extends BaseService {

    constructor({ fastify }) {
        super(fastify);
        this._User = fastify.objection.models.User;

        this.LINK_EXPIRE_MINUTES = 60;  // 60 Minutes
    }

    /**
     * Send email verification link 
     * 
     * @param {string} email 
     * @returns {object}
     */
    async resendVerification(email) {
        const tags = ['VerificationService', '@resendVerification'];
        const result = await this._User.query().findOne('email', email);

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        const user = mapUserFormat(result);
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

        return {
            user,
            link,
        };
    }

    /**
     * Verify the user account
     * 
     * @param {*} data 
     * @returns {object}
     */
    async verify(data) {
        const { email, token } = data;
        const tags = ['VerificationService', '@verify'];

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

        const user = await this._User.query().findOne('email', email);
        if (!user) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        const updatedAt = new Date().toISOString();
        const result = await this._User.query()
            .findById(user.id)
            .patch({ email_verified_at: updatedAt });

        if (!result) {
            throw new NotFoundException({ message: this._t('message.data_notfound'), tags });
        }

        return mapUserFormat(result);
    }

}
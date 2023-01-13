const { filePathFormat } = require('../../../utils/utils');

class AuthHandler {

    constructor(service, mailerService, storageService, validator) {
        this._service = service;
        this._mailerService = mailerService;
        this._storageService = storageService;
        this._validator = validator;
    }

    /**
     * Handle incoming request to authenticated user 
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
    async loginHandler(request, reply) {
        try {
            const { body } = request;
            this._validator.validateLogin(body);
            const result = await this._service.login(body);
            
            return reply.sendSuccess(({ message: request.t('auth.login_success'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to register new user
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
     async registerHandler(request, reply) {
        try {
            const data = request.files[0] || {};
            const payloads = {
                ...request.body,
                ...{ avatar: data },
            };

            this._validator.validateRegister(payloads);

            const result = await this._service.register(payloads);
            result.user.avatar = null;
            
            if (Object.keys(data).length !== 0) {
                const fileName = await this._storageService.writeFile(data, 'uploads/avatar');
                await this._service.updateAvatar(result.user.id, fileName);
                result.user.avatar = filePathFormat(fileName, 'avatar');
            }

            return reply.sendSuccess(({ message: request.t('auth.register_success'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to show specific data
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object} 
     */
    async whoamiHandler(request, reply) {
        try {
            const token = request.headers.authorization.replace('Bearer ', '');
            const result = await this._service.whoami(token);

            return reply.sendSuccess(({ message: request.t('message.retrieved'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to send reset password link
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object} 
     */
    async sendResetLinkHandler(request, reply) {
        try {
            const { body: { email }, vars: { view } } = request;
            this._validator.validateEmail({ email });
            
            const { link, user } = await this._service.sendResetLink(email);
            const html = await view('email/reset-password', { link });
            this._mailerService.sendEmail({
                to: user.email,
                subject: request.t('password.notification'),
                html,
            });

            return reply.sendSuccess(({ message: request.t('password.sent'), result: { link } }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to reset password
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object} 
     */
    async resetPasswordHandler(request, reply) {
        try {
            const { body } = request;
            this._validator.validateResetPassword(body);
            
            const result = await this._service.resetPassword(body);
            
            return reply.sendSuccess(({ message: request.t('password.reset'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to confirmation password
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object} 
     */
    async confirmPasswordHandler(request, reply) {
        try {
            const { user: { id }, body: { password } } = request;
            this._validator.validatePassword({ password });

            await this._service.confirmPassword(id, password);

            return reply.sendSuccess(({ message: request.t('password.confirmed') }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to send email verification link
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object} 
     */
    async resendVerificationHandler(request, reply) {
        try {
            const { user: { email }, vars: { view } } = request;

            this._validator.validateEmail({ email });
            
            const { link = null, user } = await this._service.resendVerification(email);
            if (!link) {
                return reply.sendSuccess(({ message: request.t('auth.email_verified'), result: { user } }));
            }

            const html = await view('email/verify', { link });
            this._mailerService.sendEmail({
                to: user.email,
                subject: request.t('verify.notification'),
                html,
            });

            return reply.sendSuccess(({ message: request.t('verify.sent'), result: { user, link } }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to verify account
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object} 
     */
    async verifyHandler(request, reply) {
        try {
            const { body, vars: { view } } = request;

            this._validator.validateVerify(body);
            
            const user = await this._service.verify(body);
            const html = await view('email/welcome', { user });
            this._mailerService.sendEmail({
                to: user.email,
                subject: request.t('verify.verified'),
                html,
            });

            return reply.sendSuccess(({ message: request.t('verify.verified'), result: { user } }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to generate new refresh token 
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
     async refreshTokenHandler(request, reply) {
        try {
            const { refreshToken } = request.body;
            const result = await this._service.refreshToken(refreshToken);
            
            return reply.sendSuccess(({ message: request.t('auth.refresh_token'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

}

module.exports = AuthHandler;
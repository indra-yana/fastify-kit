const BaseValidator = require('../../../lib/BaseValidator');

class AuthValidator extends BaseValidator {

    constructor({ fastify }) {
        super(fastify);
    }

    /**
     * Validate login payloads
     * 
     * @param {object} payloads 
     */
    validateLogin(payloads) {
        const validator = this._Joi.object({
            credential: this._Joi.string().min(2).required(),
            password: this.passwordSchema(),
            remember: this._Joi.boolean().optional(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }

    /**
     * Validate create payloads
     * 
     * @param payloads 
     */
     validateRegister(payloads) {
        const validator = this._Joi.object({
            name: this.nameSchema(),
            username: this.usernameSchema(),
            password: this.passwordSchema(),
            password_confirmation: this.passwordConfirmationSchema(),
            email: this.emailSchema(),
            avatar: this._Joi.object({
                fieldname: this._Joi.string().required(),
                originalname: this._Joi.string().required(),
                mimetype: this.imageMimetypeSchema().required(),
                size: this._Joi.number().min(1000).max(1100000).required(),  // Limit file size to 1MB 
            }).unknown().required(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
    
    /**
     * Validate email payloads
     * 
     * @param {object} payloads 
     */
    validateEmail(payloads) {
        const validator = this._Joi.object({
            email: this.emailSchema(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
    
    /**
     * Validate password payloads
     * 
     * @param {object} payloads 
     */
    validatePassword(payloads) {
        const validator = this._Joi.object({
            password: this.passwordSchema(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
    
    /**
     * Validate reset password payloads
     * 
     * @param {object} payloads 
     */
    validateResetPassword(payloads) {
        const validator = this._Joi.object({
            token: this._Joi.string().required(),
            email: this.emailSchema(),
            password: this.passwordSchema(),
            password_confirmation: this.passwordConfirmationSchema(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
    
    /**
     * Validate verification payloads
     * 
     * @param {object} payloads 
     */
    validateVerify(payloads) {
        const validator = this._Joi.object({
            token: this._Joi.string().required(),
            email: this.emailSchema(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
    
}

module.exports = AuthValidator;
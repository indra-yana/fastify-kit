const BaseValidator = require('../../../lib/BaseValidator');

class UserValidator extends BaseValidator {

    constructor({ fastify }) {
        super(fastify);
    }

    /**
     * Validate create payloads
     * 
     * @param payloads 
     */
    validateCreate(payloads) {
        const validator = this._Joi.object({
            name: this.nameSchema(),
            username: this.usernameSchema(),
            password: this.passwordSchema(),
            password_confirmation: this.passwordConfirmationSchema(),
            email: this.emailSchema(),
            avatar: this._Joi.object({
                fieldname: this._Joi.string().optional(),
                originalname: this._Joi.string().optional(),
                mimetype: this.imageMimetypeSchema().optional(),
                size: this._Joi.number().min(1000).max(1100000).optional(),  // Limit file size to 1MB 
            }).unknown().optional(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
    
    /**
     * Validate update payloads
     * 
     * @param payloads 
     */
    validateUpdate(payloads) {
        const validator = this._Joi.object({
            id: this._Joi.string().required(),
            name: this.nameSchema(),
            username: this.usernameSchema(),
            email: this.emailSchema(),
            avatar: this._Joi.object({
                fieldname: this._Joi.string().optional(),
                originalname: this._Joi.string().optional(),
                mimetype: this.imageMimetypeSchema().optional(),
                size: this._Joi.number().min(1000).max(1100000).optional(),  // Limit file size to 1MB 
            }).unknown().optional(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
    
    /**
     * Validate id payloads
     * 
     * @param payloads 
     */
    validateID(payloads) {
        const validator = this._Joi.object({
            id: this._Joi.string().required(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
}

module.exports = UserValidator;
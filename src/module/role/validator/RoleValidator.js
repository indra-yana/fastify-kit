const BaseValidator = require('../../../lib/BaseValidator');

module.exports = class RoleValidator extends BaseValidator {
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
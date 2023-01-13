const BaseValidator = require('../BaseValidator');

class UploadValidator extends BaseValidator {

    constructor({ fastify }) {
        super(fastify);
    }

    /**
     * Validate upload payloads
     * 
     * @param {object} payloads 
     */
    validateUpload(payloads) {
        const validator = this._Joi.object({
            file: this._Joi.object({
                fieldname: this._Joi.string().required(),
                originalname: this._Joi.string().required(),
                mimetype: this.mimetypeSchema().required(),
                size: this._Joi.number().min(1000).max(1100000).required(),  // Limit file size to 1MB 
            }).unknown().required(),
        }).unknown().validate(payloads);
        
        this.validationCheck(validator);
    }

    /**
     * Validate download payloads
     * 
     * @param {object} payloads 
     */
    validateDownload(payloads) {
        const validator = this._Joi.object({
            fileName: this._Joi.string().required(),
            type: this._Joi.string().optional(),
        }).validate(payloads);
        
        this.validationCheck(validator);
    }
    
}

module.exports = UploadValidator;
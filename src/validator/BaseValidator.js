/* eslint-disable function-paren-newline */
const ValidationException = require('../exceptions/ValidationException');
const { joiValidationFormat } = require('../utils/utils');

class BaseValidator {
    constructor(fastify) {
        this._fastify = fastify;
        this._t = fastify.t;
        this._Joi = fastify.Joi;
    }

    /**
     * Check the validation if fail
     * 
     * @param {*} validator 
     */
    validationCheck(validator) {
        if (validator.error) {
            throw new ValidationException({ message: this._t('message.validation_fail'), error: joiValidationFormat(validator.error.details) });
        }
    }

    /**
     * Password schema
     * 
     * @returns {void}
     */
    passwordSchema() {
        return this._Joi.string().min(6).max(128).pattern(/^[a-zA-Z0-9]{3,30}$/).required();
    }

    /**
     * Password confirmation schema
     * 
     * @returns {void}
     */
    passwordConfirmationSchema() {
        return this._Joi.string().min(6).max(128).valid(this._Joi.ref('password')).required();
    }
    
    /**
     * Email schema
     * 
     * @returns {void}
     */
    emailSchema() {
        return this._Joi.string().email().required();
    }

    /**
     * Username schema
     * 
     * @returns {void}
     */
    usernameSchema() {
        return this._Joi.string().min(3).pattern(/^[0-9A-Za-z.\-_]+$/).required();
    }

    /**
     * Name schema
     * 
     * @returns {void}
     */
    nameSchema() {
        return this._Joi.string().min(2).max(255).required();
    }

    /**
     * Mimetype schema
     * 
     * @returns {void}
     */
    mimetypeSchema() {
        return this._Joi.string().valid(
            'image/apng', 
            'image/avif', 
            'image/gif', 
            'image/jpeg', 
            'image/png', 
            'image/webp', 
            'application/pdf', 
            'application/vnd.ms-excel', 
            'application/msword', 
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation').required();
    }

    /**
     * Image mimetype schema
     * 
     * @returns {void}
     */
    imageMimetypeSchema() {
        return this._Joi.string().valid(
            'image/apng', 
            'image/avif', 
            'image/gif', 
            'image/jpeg', 
            'image/png', 
            'image/webp');
    }

}

module.exports = BaseValidator;
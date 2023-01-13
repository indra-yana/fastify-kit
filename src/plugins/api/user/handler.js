const { filePathFormat } = require('../../../utils/utils');

class UserHandler {

    constructor(service, storageService, validator) {
        this._service = service;
        this._validator = validator;
        this._storageService = storageService;
    }

    /**
     * Handle incoming request to create new data
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
    async createHandler(request, reply) {
        try {
            const data = request.files[0] || {};
            const payloads = {
                ...request.body,
                ...{ avatar: data },
            };

            this._validator.validateCreate(payloads);

            const result = await this._service.create(payloads);
            result.avatar = null;

            if (Object.keys(data).length !== 0) {
                const fileName = await this._storageService.writeFile(data, 'uploads/avatar');
                await this._service.updateAvatar(result.id, fileName);
                result.avatar = filePathFormat(fileName, 'avatar');
            }

            return reply.sendSuccess(({ message: request.t('message.created'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to update existing data
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
    async updateHandler(request, reply) {
        try {
            const data = request.files[0] || {};
            const payloads = {
                ...request.body,
                ...{ avatar: data },
            };

            this._validator.validateUpdate(payloads);

            const { id } = payloads;
            const result = await this._service.update(id, payloads);
            result.avatar = null;
            
            if (Object.keys(data).length !== 0) {
                const fileName = await this._storageService.writeFile(data, 'uploads/avatar');
                await this._service.updateAvatar(result.id, fileName);
                result.avatar = filePathFormat(fileName, 'avatar');
            }

            return reply.sendSuccess(({ message: request.t('message.updated'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to get collection of data
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns 
     */
    async listHandler(request, reply) {
        try {
            const result = await this._service.users();
            return reply.sendSuccess(({ message: request.t('message.retrieved'), result }));
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
    async showHandler(request, reply) {
        try {
            this._validator.validateID(request.params);

            const { id } = request.params;

            const result = await this._service.show(id);
            return reply.sendSuccess(({ message: request.t('message.retrieved'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }
    
    /**
     * Handle incoming request to delete existing data
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
    async deleteHandler(request, reply) {
        try {
            this._validator.validateID(request.body);

            const { id } = request.body;

            const result = await this._service.delete(id);
            return reply.sendSuccess({ message: request.t('message.deleted'), result });
        } catch (error) {
            return reply.sendError(error);
        }
    }
}

module.exports = UserHandler;
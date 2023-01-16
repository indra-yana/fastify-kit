const { filePathFormat, isEmpty } = require('../../../../utils/utils');

module.exports = class UserHandler {

    constructor(userService, storageService, validator) {
        this._userService = userService;
        this._storageService = storageService;
        this._validator = validator;
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

            const result = await this._userService.create(payloads);
            result.avatar = null;

            if (!isEmpty(data)) {
                const fileName = await this._storageService.writeFile(data, 'uploads/avatar');
                await this._userService.updateAvatar(result.id, fileName);
                result.avatar = filePathFormat(fileName, 'avatar');
            }

            return reply.success(({ message: request.t('message.created'), result }));
        } catch (error) {
            return reply.error(error);
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
            const result = await this._userService.update(id, payloads);
            result.avatar = null;

            if (!isEmpty(data)) {
                const fileName = await this._storageService.writeFile(data, 'uploads/avatar');
                await this._userService.updateAvatar(result.id, fileName);
                result.avatar = filePathFormat(fileName, 'avatar');
            }

            return reply.success(({ message: request.t('message.updated'), result }));
        } catch (error) {
            return reply.error(error);
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
            const result = await this._userService.users();
            return reply.success(({ message: request.t('message.retrieved'), result }));
        } catch (error) {
            return reply.error(error);
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

            const result = await this._userService.show(id);
            return reply.success(({ message: request.t('message.retrieved'), result }));
        } catch (error) {
            return reply.error(error);
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

            const result = await this._userService.delete(id);
            return reply.success({ message: request.t('message.deleted'), result });
        } catch (error) {
            return reply.error(error);
        }
    }
}
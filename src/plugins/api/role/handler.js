class RoleHandler {

    constructor(service, validator) {
        this._service = service;
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
            this._validator.validateCreate(request.body);

            const result = await this._service.create(request.body);

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
            this._validator.validateUpdate(request.body);

            const { id } = request.body;
            const result = await this._service.update(id, request.body);

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
            const result = await this._service.roles();
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

module.exports = RoleHandler;
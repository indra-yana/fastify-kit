class UploadHandler {

    constructor(service, fileService, validator) {
        this._service = service;
        this._fileService = fileService;
        this._validator = validator;
    }

    /**
     * Handle incoming request to upload a file
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
    async uploadHandler(request, reply) {
        try {
            const data = request.files[0] || {};
            const { type } = request.body;
            this._validator.validateUpload({ file: data });

            let dir = 'uploads'; 
            if (type === 'evidence') {
                dir += '/evidence';
            } else if (type === 'avatar') {
                dir += '/avatar';
            }
            
            const result = await this._service.writeFile(data, dir);
            await this._fileService.create({
                userId: request.user.id,
                name: result,
                type,
            });

            return reply.sendSuccess(({ message: request.t('message.uploaded'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }
    
    /**
     * Handle incoming request to download a file
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
    async downloadHandler(request, reply) {
        try {
            this._validator.validateDownload(request.params);

            const { fileName, type = null } = request.params;

            let dir = 'uploads';
            if (type === 'evidence') {
                dir += '/evidence';
            } else if (type === 'avatar') {
                dir += '/avatar';
            }

            return reply.download(`${dir}/${fileName}`);
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to preview a file
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
    async previewHandler(request, reply) {
        try {
            this._validator.validateDownload(request.params);

            const { fileName, type = null } = request.params;

            let dir = 'uploads';
            if (type === 'evidence') {
                dir += '/evidence';
            } else if (type === 'avatar') {
                dir += '/avatar';
            }

            return reply.sendFile(`${dir}/${fileName}`);
        } catch (error) {
            return reply.sendError(error);
        }
    }

    /**
     * Handle incoming request to get user files
     * 
     * @param {*} request 
     * @param {*} reply 
     * @returns {object}
     */
     async userFilesHandler(request, reply) {
        try {
            const { type = null } = request.params;

            const result = await this._fileService.userFiles(request.user.id, type);
            
            return reply.sendSuccess(({ message: request.t('message.retrieved'), result }));
        } catch (error) {
            return reply.sendError(error);
        }
    }

}

module.exports = UploadHandler;
const { getUploadDirectory } = require('../../../../lib/upload');
const { filePathFormat } = require('../../../../utils/utils');

module.exports = class FileHandler {
	constructor(fileService, storageService, validator) {
		this._fileService = fileService;
		this._storageService = storageService;
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

			const dir = getUploadDirectory(type);
			const result = await this._storageService.writeFile(data, dir);

			await this._fileService.create({
				userId: request.user.id,
				name: result,
				type,
			});

			return reply.success(({ message: request.t('message.uploaded'), result: filePathFormat(result, type) }));
		} catch (error) {
			return reply.error(error);
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

			const dir = getUploadDirectory(type);

			return reply.download(`public/${dir}/${fileName}`);
		} catch (error) {
			return reply.error(error);
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
			
			const dir = getUploadDirectory(type);

			return reply.sendFile(`public/${dir}/${fileName}`);
		} catch (error) {
			return reply.error(error);
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

			return reply.success(({ message: request.t('message.retrieved'), result }));
		} catch (error) {
			return reply.error(error);
		}
	}

}
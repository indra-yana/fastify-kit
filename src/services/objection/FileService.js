const { mapFileFormat } = require('../../utils/utils');
const BaseService = require('../BaseService');
const InvariantException = require('../../exceptions/InvariantException');
const QueryException = require('../../exceptions/QueryException');

class FileService extends BaseService {

    constructor({ fastify }) {
        super(fastify);

        this._users = [];
        ({ file: this._file, user: this._user } = this._fastify.objection.models);
    }

    /**
     * Create new data
     * 
     * @param {*} data 
     * @returns {object}
     */
    async create(data) {
        const tags = ['FileService', '@create'];
        const { userId, name, type } = data;
        const newFile = {
            user_id: userId,
            name,
            type,
        };

        const result = await this._file.query()
                                .insert(newFile)
                                .returning('*')
                                .catch((error) => ({ error }));

        if (result.error) {
            throw new QueryException({ error: result.error, tags });
        }

        if (!result) {
            throw new InvariantException({ message: this._t('message.created_fail'), tags });
        }

        return mapFileFormat(result);
    }

    /**
     * Get collection of data
     * 
     * @returns {object}
     */
     async userFiles(userId, type) {
        const tags = ['FileService', '@files'];
        const result = await this._user.relatedQuery('files')
                                .for(userId)
                                .where((builder) => (type ? builder.where('type', type) : builder));

        return result.map(mapFileFormat);
    }
}

module.exports = FileService;
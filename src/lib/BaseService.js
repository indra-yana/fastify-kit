class BaseService {
    constructor(fastify) {
        this._app = fastify;
        this._locale = fastify.Lang.locale;
        this._t = fastify.Lang.t;
    }

}

module.exports = BaseService;
class BaseService {
    constructor(fastify) {
        this._fastify = fastify;
        this._locale = fastify.locale;
        this._t = fastify.t;
    }

}

module.exports = BaseService;
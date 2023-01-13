const fp = require('fastify-plugin');

const success = ({ result = [], message, code }) => {
    return {
        statusCode: code || 200,
        status: 'success',
        message: message || 'Well done!',
        data: result,
    };
};

const error = (throwable, { errorBag = [], message }) => {
    return {
        statusCode: throwable.statusCode || 500,
        status: 'error',
        message: `An error occured! ${throwable.message || message}`,
        error: errorBag,
    };
};

function response(fastify, opts, done) {
    fastify.decorateReply('success', function (args) {
        return this.code(args.statusCode || 200).send(success(args));
    });

    fastify.decorateReply('error', function (args) {
        return this.code(args.statusCode || 500).send(error(args, { errorBag: args.error }));
    });

    done();
}

module.exports = fp(response, {
    name: `${process.env.PLUGIN_NAME_SPACE || '@app'}/response`,
    version: '1.0',
});
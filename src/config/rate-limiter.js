module.exports = {
    default: {
        global: true,
        max: 60,
        timeWindow: '1 minute',
        hook: 'preHandler',
        errorResponseBuilder: function (request, context) {
            return {
                statusCode: 429,
                status: 'error',
                error: 'Rate limit exceeded',
                message: request.t('message.rate_limit_exceeded', { after: context.after }),
            };
        },
    },

    login_attemp: {
        max: process.env.NODE_ENV === 'production' ? 2 : 60,
        timeWindow: '1 minute',
        errorResponseBuilder: function (request, context) {
            return {
                statusCode: 429,
                status: 'error',
                error: 'Rate limit exceeded',
                message: request.t('auth.throttled', { after: context.after }),
            };
        },
    },

    password_reset: {
        max: process.env.NODE_ENV === 'production' ? 1 : 60,
        timeWindow: '1 minute',
        errorResponseBuilder: function (request, context) {
            return {
                statusCode: 429,
                status: 'error',
                error: 'Rate limit exceeded',
                message: request.t('password.throttled', { after: context.after }),
            };
        },
    },

    verify: {
        max: process.env.NODE_ENV === 'production' ? 2 : 60,
        timeWindow: '1 minute',
        errorResponseBuilder: function (request, context) {
            return {
                code: 429,
                status: 'error',
                error: 'Rate limit exceeded',
                message: request.t('verify.throttled', { after: context.after }),
            };
        },
    },
};
const config = require('../../../../config');

const routes = (fastify, { handler, meta }) => [
    {
        method: 'POST',
        url: '/api/v1/auth/login',
        preHandler: [
            fastify.rateLimit(config('rate_limit.login_attemp')),
        ],
        handler: async (request, reply) => handler.loginHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/api/v1/auth/register',
        preHandler: [
            fastify.upload.any(),
        ],
        handler: async (request, reply) => handler.registerHandler(request, reply),
    },
    {
        method: 'GET',
        url: '/api/v1/auth/whoami',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
        ],
        handler: async (request, reply) => handler.whoamiHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/api/v1/auth/password/email',
        preHandler: [
            fastify.rateLimit(config('rate_limit.password_reset')),
        ],
        handler: async (request, reply) => handler.sendResetLinkHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/api/v1/auth/password/reset',
        handler: async (request, reply) => handler.resetPasswordHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/api/v1/auth/password/confirm',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
        ],
        handler: async (request, reply) => handler.confirmPasswordHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/api/v1/auth/verify/resend',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
            fastify.rateLimit(config('rate_limit.verify')),
        ],
        handler: async (request, reply) => handler.resendVerificationHandler(request, reply),
    },
    {
        method: 'PUT',
        url: '/api/v1/auth/verify',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
        ],
        handler: async (request, reply) => handler.verifyHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/api/v1/auth/refreshToken',
        handler: async (request, reply) => handler.refreshTokenHandler(request, reply),
    },
    
];

module.exports = routes;
const rateLimiter = require('../../../../config/rate-limiter');

const routes = (fastify, { handler }) => [
    {
        method: 'POST',
        url: '/auth/login',
        preHandler: [
            fastify.rateLimit(rateLimiter.login_attemp),
        ],
        handler: async (request, reply) => handler.loginHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/auth/register',
        preHandler: [
            fastify.upload.any(),
        ],
        handler: async (request, reply) => handler.registerHandler(request, reply),
    },
    {
        method: 'GET',
        url: '/auth/whoami',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
        ],
        handler: async (request, reply) => handler.whoamiHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/auth/password/email',
        preHandler: [
            fastify.rateLimit(rateLimiter.password_reset),
        ],
        handler: async (request, reply) => handler.sendResetLinkHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/auth/password/reset',
        handler: async (request, reply) => handler.resetPasswordHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/auth/password/confirm',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
        ],
        handler: async (request, reply) => handler.confirmPasswordHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/auth/verify/resend',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
            fastify.rateLimit(rateLimiter.verify),
        ],
        handler: async (request, reply) => handler.resendVerificationHandler(request, reply),
    },
    {
        method: 'PUT',
        url: '/auth/verify',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
        ],
        handler: async (request, reply) => handler.verifyHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/auth/refreshToken',
        handler: async (request, reply) => handler.refreshTokenHandler(request, reply),
    },

];

module.exports = routes;
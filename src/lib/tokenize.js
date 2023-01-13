const authConfig = require('../config/auth');

const ACCESS_TOKEN_OPTS = authConfig.jwt.access_token;
const REFRESH_TOKEN_OPTS = authConfig.jwt.refresh_token;

module.exports.generateToken = function(_jwt, user) {
    const accessToken = _jwt.sign(user, ACCESS_TOKEN_OPTS);
    const refreshToken = _jwt.sign({ id: user.id }, REFRESH_TOKEN_OPTS);

    return {
        token: {
            accessToken,
            refreshToken,
        },
    };
}

module.exports.decodeToken = function (_jwt, token) {
    return _jwt.decode(token);
}
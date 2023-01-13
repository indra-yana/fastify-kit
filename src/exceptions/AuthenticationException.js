const ClientException = require('./ClientException');

class AuthenticationException extends ClientException {

    constructor({ message = 'Unathenticated', error = [], tags = [] }) {
        super(message, 401);
        this.name = 'Authentication Exception';
        this.error = error;
        this.tags = tags;

        this.saveLog();
    }

}

module.exports = AuthenticationException;
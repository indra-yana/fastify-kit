const ClientException = require('./ClientException');

class AuthorizationException extends ClientException {

    constructor({ message = 'Unauthorized', error = [], tags = [] }) {
        super(message, 403);
        this.name = 'Authorization Exception';
        this.error = error;
        this.tags = tags;

        this.saveLog();
    }

}

module.exports = AuthorizationException;
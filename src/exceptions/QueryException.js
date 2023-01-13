const ServerException = require('./ServerException');

class QueryException extends ServerException {

    constructor({ message = 'Failed to excecuted query', error = [], tags = [] }) {
        super(message);
        this.name = 'Query Exception';
        this.error = error;
        this.tags = tags;

        this.saveLog();
    }

}

module.exports = QueryException;
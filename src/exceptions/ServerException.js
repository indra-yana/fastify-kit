class ServerException extends Error {

    constructor(message = 'Internal Server Error', statusCode = 500) {
        super(message);
        this.name = 'Internal Server Exception';
        this.statusCode = statusCode;
    }

    /**
     * Write or Save the log to database or external file
     */
    async saveLog() {
        console.log(this.name, {
            message: `${this.name} - ${this.message}`,
            error: this.error,
            tags: this.tags,
            stack: this.stack,
        });
    }

}

module.exports = ServerException;
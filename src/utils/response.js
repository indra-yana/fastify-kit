const response = {
    success: function({ result = [], message = 'Well done!', statusCode = 200 }) {
        return {
            statusCode,
            status: 'success',
            message,
            data: result,
        };
    },
    error: function(err, { error = [], message = 'An error occured!' }) {
        return {
            statusCode: err.statusCode || 500,
            status: 'error',
            message: err.message || message,
            error: error,
        };
    },
};

module.exports = response;
const responseModel = function responseModel({ message = "", error = false }) {
    return { message, error };
};

module.exports = responseModel;

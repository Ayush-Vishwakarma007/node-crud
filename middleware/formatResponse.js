const generateResponse = (data, statusCode, description, status) => {
    return {
        data: data,
        status: {
            code: statusCode,
            description: description,
            status: status
        }
    };
};

const formatResponse = (req, res, next) => {
    const originalSend = res.send;
    res.send = (data, statusCode, description, status) => {
        try {
            const formattedResponse = generateResponse(data, statusCode, description, status);
            const jsonString = JSON.stringify(formattedResponse);
            res.setHeader('Content-Type', 'application/json');
            originalSend.call(res, jsonString);
        } catch (error) {
            console.error('Error sending response:', error);
            originalSend.call(res, { error: 'Internal Server Error' });
        }
    };
    next();
};

module.exports = formatResponse;

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vommy Chat API',
            version: '1.0.0',
            description: 'API documentation for Vommy Chat'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ]
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
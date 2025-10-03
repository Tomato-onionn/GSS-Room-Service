const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Meeting Room Management API',
      version: '1.0.0',
      description: 'API documentation for Meeting Room Management System with auto-completion feature',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './src/routes/*.js', 
    './src/models/*.js',
    './src/controllers/*.js'
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
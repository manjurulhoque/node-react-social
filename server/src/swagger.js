const swaggerAutogen = require("swagger-autogen");

const doc = {
  info: {
    title: "Social Media API",
    description: "API for social media application",
    version: "1.0.0",
  },
  host: "localhost:8800",
  basePath: "/api",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter your bearer token in the format **Bearer &lt;token&gt;**"
    }
  }
};

const outputFile = "./src/swagger.json";
const endpointsFiles = [
  "./src/routes/auth.ts",
  "./src/routes/users.ts",
  "./src/routes/posts.ts"
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

// Generate the Swagger documentation
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);

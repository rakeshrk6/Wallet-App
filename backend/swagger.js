const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Wallet App API",
    description: "This is API documentation of Wallet Web App",
  },
  host: "localhost:8000",
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen(outputFile, routes, doc);

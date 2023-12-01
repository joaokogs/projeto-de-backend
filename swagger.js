const sawaggerAutogen = require('swagger-autogen')();

output = 'swagger_doc.json';

endpoints = ['./index.js']

sawaggerAutogen(output,endpoints)
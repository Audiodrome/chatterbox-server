var messages = {};
messages.results = [
  {username: 'MaxPower', text: 'This ROCKS!!!'},
  {username: 'Mercedes-Benz', text: 'G CLASS AMG'},
  {username: 'Ferrari', text: 'Paris to Milan'}
];

var objectId = 0;

var headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  'Access-Control-Max-Age': 10, // Seconds.
  'Content-Type': 'application/json',
};

var actions = {
  GET: function(request, response, statusCode) {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(messages));
  },
  POST: function(request, response, statusCode) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      body = JSON.parse(body);
      body.objectId = objectId++;
      messages.results.push(body);
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(messages));
    });
  },
  OPTIONS: function(request, response, statusCode) {
    response.writeHead(statusCode, headers);
    response.end();
  }
};

var sendResponse = function(request, response, statusCode) {
  var action = actions[request.method];

  if (action) {
    action(request, response, statusCode);
  }
};

var requestHandler = function (request, response) {

  var statusCode = {
    '200': 200,
    '201': 201,
    '404': 404
  };
  if (request.method === 'OPTIONS') {
    sendResponse(request, response, statusCode[200]);
  } else if (request.method === 'GET') {
    sendResponse(request, response, statusCode[200]);
  } else if (request.method === 'POST') {
    sendResponse(request, response, statusCode[201]);
  }
};

module.exports = {sendResponse: sendResponse, requestHandler: requestHandler};

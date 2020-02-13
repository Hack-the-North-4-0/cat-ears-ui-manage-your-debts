const requestIdHandler = require('./request_id');
const localsStarter = require('./locals_starter');
const inboundLogger = require('./inbound_logger');

const loadHandlers = (server) => {
  server.pre(requestIdHandler);
  server.pre(localsStarter);
  server.pre(inboundLogger);
  return server;
};

module.exports = loadHandlers;

module.exports = {
  app: {
    http2: {
      enabled: 'APP_HTTP2_ENABLED',
      key: 'APP_HTTP2_KEY',
      cert: 'APP_HTTP2_CERT',
    },
    name: 'APP_NAME',
    hostname: 'APP_HOSTNAME',
    port: 'APP_PORT',
    source: 'APP_SOURCE',
  },
  logger: {
    level: 'LOGGER_LEVEL',
  },
};

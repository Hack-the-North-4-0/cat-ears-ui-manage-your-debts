module.exports = {
  app: {
    http2: {
      enabled: false,
      key: '/path/to/key/file',
      cert: '/path/to/cert/file',
    },
    name: 'manage-your-debts',
    hostname: 'localhost',
    port: '8080',
    source: 'file',
  },
  functionality: {
  },
  nunjucks: {
    options: {},
  },
  logger: {
    level: 'info',
  },
};

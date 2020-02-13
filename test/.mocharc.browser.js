module.exports = {
  require: ['test/spec/helpers/setup.js', 'test/spec/helpers/run_server.js', 'test/spec/helpers/setup_nocks.js'],
  spec: 'test/spec/browser/**/*.js',
  timeout: 5000,
  exit: true,
};

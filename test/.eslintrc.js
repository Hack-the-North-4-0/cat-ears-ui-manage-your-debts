module.exports = {
  ...require('@dwp/eslint-config-mocha'),
  plugins: ['mocha'],
  "globals": {
    "sinon": true,
    "expect": true,
    "request": true,
    "clearMetrics": true,
    "testRequire": true,
    "clearModule": true,
    "importFresh": true,
    "startMockRequire": true,
    "stopMockRequire": true,
    "refreshPage": true,
    "generateSignature": true,
    "decodeToken": true,
    "testValidity": true,
    "testInvalidity": true,
  },
  overrides: [
    {
      files: ['*_spec.js'],
      rules: {
        'no-unused-expressions': 'off',
        'mocha/no-mocha-arrows': 'error',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-skipped-tests': 'warn',
        'func-names': 'off',             // describe and if use unnamed functions
        'prefer-arrow-callback': 'off',  // Arrow callback breaks describe and if, OK elsewhere
        'quote-props': 'off',     // proxyquire uses quoted string literals to replace modules
        'global-require': 'off',  // Best practice is to limit scope of to test suites
      }
    },
  ],
};

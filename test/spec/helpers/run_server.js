process.env.ALLOW_CONFIG_MUTATIONS = 'true';
process.env.NODE_CONFIG = JSON.stringify(require('../../../config/test'));
const testConfig = importFresh('config');
startMockRequire('config', testConfig);

const app = require('../../../src/app');

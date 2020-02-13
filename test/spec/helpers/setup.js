/* eslint-disable import/no-dynamic-require,global-require */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');

const tokenHandler = require('../../../src/lib/route-creator');

process.env.NODE_ENV = 'test';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonChai);

// Set up globals
global.sinon = require('sinon');

global.expect = chai.expect;
global.request = chai.request;

global.testRequire = module => require(module);

global.importFresh = (module) => require('import-fresh')(module);

global.clearModule = (module) => require('clear-require')(module);

global.startMockRequire = (module, replacement) => require('mock-require')(module, replacement);

global.stopMockRequire = (module) => require('mock-require').stop(module);

global.refreshPage = async (browser, visitPath) => {
  await browser.visit(visitPath);
};

global.generateSignature = async (browser, cookieName, cookieContents) => {
  const signature = await tokenHandler.generateSignature(cookieContents);
  browser.setCookie({
    name: cookieName,
    domain: 'localhost',
    value: signature,
    sameSite: 'Strict',
    path: '/',
    httpOnly: true,
    secure: true,
    strict: true,
    'max-age': 3600,
  });
};

global.decodeToken = async (token) => tokenHandler.decodeToken(token);

global.testValidity = (localBrowser, country) => {
  localBrowser.pressButton('button');
  localBrowser.assert.hasNoClass(
      '#single-postcode-panel',
      'govuk-visually-hidden',
      'Panel should display once text is entered',
  );
  localBrowser.assert.hasClass(
      '#single-postcode-panel > .govuk-panel',
      'govuk-panel--confirmation',
      'Panel should become valid on allowed postcode',
  );
  localBrowser.assert.text(
      '#single-postcode-panel > .govuk-panel > #postcode-panel-result',
      `You are in: ${country}`,
      `Panel should that the user is in ${country}`,
  );
};

global.testNotIncluded = (localBrowser) => {
  localBrowser.pressButton('button');
  localBrowser.assert.hasNoClass(
      '#single-postcode-panel',
      'govuk-visually-hidden',
      'Panel should display once text is entered',
  );
  localBrowser.assert.hasClass(
      '#single-postcode-panel > .govuk-panel',
      'govuk-panel--primary',
      'Panel should be a different colour on a valid-but-not-Scottish postcode',
  );
  localBrowser.assert.text(
      '#single-postcode-panel > .govuk-panel > #postcode-panel-result',
      'The postcode that you provided was not found within Scotland. It may exist in England, or not at all.',
      'Panel should report that the postcode is neither in Scotland or on the border area',
  );
};

global.testInvalidity = (localBrowser) => {
  localBrowser.pressButton('button');
  localBrowser.assert.hasNoClass(
      '#single-postcode-panel',
      'govuk-visually-hidden',
      'Panel should display once text is entered',
  );
  localBrowser.assert.hasClass(
      '#single-postcode-panel > .govuk-panel',
      'govuk-panel--invalid',
      'Panel should become invalid on invalid postcode',
  );
  localBrowser.assert.text(
      '#single-postcode-panel > .govuk-panel > .govuk-panel__body',
      'The postcode that you provided is invalid...',
      'Panel should report message invalidity',
  );
};

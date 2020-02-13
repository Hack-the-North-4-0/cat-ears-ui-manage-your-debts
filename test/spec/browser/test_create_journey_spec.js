const Zombie = require('zombie');

const baseLink = 'http://localhost:9090/';
const introLink = `${baseLink}create-journey`;

describe('The create journey page', function () {
  const browser = new Zombie();

  afterEach(async function () {
    browser.deleteCookies();
  });

  beforeEach(async function () {
    browser.deleteCookies();
  });

  it('Should redirect to choosing a sender version with no other options', function () {
    return refreshPage(browser, introLink).then(function () {
      browser.assert.redirected('Browser should have been redirected to a new page');
      browser.assert.url(`${baseLink}choose-version`, 'The first page should be to choose a sender SFT version');
    });
  });

  it('Should redirect to choosing a sender version with an empty route options cookie', async function () {
    browser.setCookie({ name: 'route-options', domain: 'localhost', value: ''});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}choose-version`, 'The first page should be to choose a sender SFT version');
  });

  it('Should redirect to choosing a sender version with an unfilled route options cookie', async function () {
    await generateSignature(browser, 'route-options', {});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}choose-version`, 'The first page should be to choose a sender SFT version');
  });

  it('Should redirect to choosing a sender version with route cookie that is empty', function () {
    return generateSignature(browser, 'route-options', { route: {}})
    .then(function () { return refreshPage(browser, introLink); })
    .then(function () {
      browser.assert.redirected('Browser should have been redirected to a new page');
      browser.assert.url(`${baseLink}choose-version`, 'The first page should be to choose a sender SFT version');
    });
  });

  it('Should redirect to choosing sender options with a route cookie that has an agent version', async function () {
    await generateSignature(browser, 'route-options', { route: { agent_version: '2.2.1/jre8' }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}choose-sender-options`, 'The second page should be to fill in the sender options');
  });

  it ('Should redirect to choosing sender version with a route cookie that has only sender options', async function () {
    await generateSignature(browser, 'route-options', { route: { sender_options: {} }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}choose-version`, 'The user should be directed to fill in the sender version');
  });

  it('Should redirect to choosing a new action with a route cookie that has sender options', async function () {
    await generateSignature(browser, 'route-options', { route: { agent_version: '2.2.1/jre8', sender_options: {} }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}choose-next-action`, 'The user should have been directed to choosing the next action');
  });

  it('Should redirect to choosing a new action with a route cookie that has an empty actions option', async function () {
    await generateSignature(browser, 'route-options', { route: { agent_version: '2.2.1/jre8', sender_options: {}, agent_actions: [] }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}choose-next-action`, 'The user should have been directed to choosing the next action');
  });

  it('Should redirect to choosing a new action with a route cookie that has an empty agents option', async function () {
    await generateSignature(browser, 'route-options', { route: { agent_version: '2.2.1/jre8', sender_options: {}, agents: [] }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}choose-next-action`, 'The user should have been directed to choosing the next action');
  });

  it('Should redirect to choosing a new action with a route cookie that has empty agents and actions options', async function () {
    await generateSignature(browser, 'route-options', { route: { agent_version: '2.2.1/jre8', sender_options: {}, agent_actions: [], agents: [] }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}choose-next-action`, 'The user should have been directed to choosing the next action');
  });

  it('Should redirect to reviewing the current journey with a route cookie that has filled actions', async function () {
    await generateSignature(browser, 'route-options', { route: { agent_version: '2.2.1/jre8', sender_options: {}, agent_actions: [{ name: 'Action A' }] }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}review-journey`, 'The user should have been directed to choosing the next action');
  });

  it('Should redirect to reviewing the current journey with a route cookie that has unrecognised actions', async function () {
    await generateSignature(browser, 'route-options', { route: { agent_version: '2.2.1/jre8', sender_options: {}, agents: [{ name: 'Agent A', actions: [{ name: 'Action A'}] }], agent_actions: [] }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}review-journey`, 'The user should have been directed to choosing the next action');
  });

  it('Should redirect to reviewing the whole journey with a terminating action in the route cookie', async function () {
    await generateSignature(browser, 'route-options', { route: { agent_version: '2.2.1/jre8', sender_options: {}, agents: [{ name: 'Action A', actions: { name: 'writeFile' } }], agent_actions: [] }});
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to a new page');
    browser.assert.url(`${baseLink}review-new-journey`, 'The user should have been directed to choosing the next action');
  });
});

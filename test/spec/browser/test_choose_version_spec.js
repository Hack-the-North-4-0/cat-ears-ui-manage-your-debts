const Zombie = require('zombie');

const baseLink = 'http://localhost:9090/';
const introLink = `${baseLink}choose-version`;

describe('The choose version page', function () {
  const browser = new Zombie();

  afterEach(async function () {
    browser.deleteCookies();
    await refreshPage(browser, introLink);
  });

  beforeEach(async function () {
    browser.deleteCookies();
    await refreshPage(browser, introLink);
  });

  it('Should display a set of options and a submit button', function () {
    const versionOption = browser.field('SFT version 2.2.1');
    const submitButton = browser.button('Save and continue');
    expect(versionOption, 'Expected option was not found').is.not.null;
    expect(submitButton, 'Expected submission button was not found').is.not.null;
  });

  it('Should display an error when no version is chosen', async function () {
    let errorText = browser.text('Version was not specified - please select a version');
    expect(errorText, 'Error text should be hidden').to.be.empty;
    await browser.pressButton('Save and continue');
    expect(browser.redirected, 'Browser should not have been redirected').to.be.false;
    errorText = browser.text('Version was not specified - please select a version');
    expect(errorText, 'Error text should be shown').to.not.be.null;
  });

  it('Should redirect to choosing sender options when a version is chosen correctly', async function () {
    browser.choose('SFT version 2.2.1');
    await browser.pressButton('Save and continue');
    browser.assert.redirected('Page should have moved onto the sender options screen');
    browser.assert.url(`${baseLink}choose-sender-options`, 'Page should be showing sender options');
  });

  it('Should generate a new token with agent version in it', async function () {
    browser.choose('SFT version 2.2.1');
    await browser.pressButton('Save and continue');
    const token = await decodeToken(browser.getCookie('route-options'));
    expect(token).to.have.own.property('route');
    expect(token.route).to.have.own.property('agent_version');
    expect(token.route.agent_version).to.equal('2.2.1/jre8');
  });

  it('Should handle an existing empty token and update the agent version in it', async function () {
    await generateSignature(browser, 'route-options', {});
    await refreshPage(browser, introLink);
    browser.choose('SFT version 2.2.1');
    await browser.pressButton('Save and continue');
    const token = await decodeToken(browser.getCookie('route-options'));
    expect(token).to.have.own.property('route');
    expect(token.route).to.have.own.property('agent_version');
    expect(token.route.agent_version).to.equal('2.2.1/jre8');
  });

  it('Should overwrite an existing token with a new agent version in it', async function () {
    await generateSignature(browser, 'route-options', {
      route: {
        agent_version: '2.2.0/jre7',
        agents: [{name: 'Agent A', actions: [{name: 'Action A'}]}],
      }
    });
    await refreshPage(browser, introLink);
    browser.choose('SFT version 2.2.1');
    await browser.pressButton('Save and continue');
    const token = await decodeToken(browser.getCookie('route-options'));
    expect(token).to.have.own.property('route');
    expect(token.route).to.have.own.property('agent_version');
    expect(token.route.agent_version).to.equal('2.2.1/jre8');
    expect(token.route).to.have.own.property('agents');
    expect(token.route.agents).to.have.length(1);
  });
});

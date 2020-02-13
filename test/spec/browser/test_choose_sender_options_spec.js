const Zombie = require('zombie');

const baseLink = 'http://localhost:9090/';
const introLink = `${baseLink}choose-sender-options`;

const expectedSchema = require('../helpers/nocks/schemas/agents/agent.sender.schema');
const actionsConstant = 1;

describe('The choose sender options page', function () {
  const browser = new Zombie();

  afterEach(async function () {
    browser.deleteCookies();
    await refreshPage(browser, introLink);
  });

  beforeEach(async function () {
    browser.deleteCookies();
    await refreshPage(browser, introLink);
  });

  it('Should redirect to the homepage if no cookies are set', async function () {
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to root');
    browser.assert.url(baseLink, 'Browser should have been redirected to root');
  });

  it('Should redirect to the homepage if an empty route cookie is set', async function () {
    await generateSignature(browser, 'route-options', {
      route: {},
    });
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to root');
    browser.assert.url(baseLink, 'Browser should have been redirected to root');
  });

  it('Should redirect to choosing a new SFT version if the version is junk', async function () {
    await generateSignature(browser, 'route-options', {
      route: {
        agent_version: 'junk-data-here',
      },
    });
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to choosing a new version');
    browser.assert.url(`${baseLink}choose-version`, 'Browser should have been redirected to choosing a new version');
  });

  it('Should redirect to choosing a new SFT version on an invalid SFT version', async function () {
    await generateSignature(browser, 'route-options', {
      route: {
        agent_version: '1.0.0/jre8',
      },
    });
    await refreshPage(browser, introLink);
    browser.assert.redirected('Browser should have been redirected to choosing a new version');
    browser.assert.url(`${baseLink}choose-version`, 'Browser should have been redirected to choosing a new version');
  });

  it('Should display a set of text fields and a submit button', async function () {
    await generateSignature(browser, 'route-options', {
      route: {
        agent_version: '2.2.1/jre8',
      },
    });
    await refreshPage(browser, introLink);
    const routeNameField = browser.field('name');
    const submitButton = browser.button('Save and continue');
    expect(routeNameField, 'Expected option was not found').is.not.null;
    expect(submitButton, 'Expected submission button was not found').is.not.null;
  });

  it('Should display errors on all required fields if none are specified', async function () {
    await generateSignature(browser, 'route-options', {
      route: {
        agent_version: '2.2.1/jre8',
      },
    });
    await refreshPage(browser, introLink);
    await browser.pressButton('Save and continue');
    expect(browser.querySelectorAll('.govuk-form-group--error').length).to.equal(expectedSchema.schema.required.length - actionsConstant);
  });

  expectedSchema.schema.required.forEach((field) => {
    if (field !== 'actions') {
      it(`The ${field} field should only have one associated label`, async function () {
        await generateSignature(browser, 'route-options', {
          route: {
            agent_version: '2.2.1/jre8',
          },
        });
        await refreshPage(browser, introLink);
        const testingField = browser.field(field);
        expect(testingField.labels).to.have.length(1);
      });

      it(`The ${field} field should be marked as required`, async function () {
        await generateSignature(browser, 'route-options', {
          route: {
            agent_version: '2.2.1/jre8',
          },
        });
        await refreshPage(browser, introLink);
        const testingField = browser.field(field).labels[0];
        expect(testingField.innerHTML).to.contain('*');
      });
    }
  });

  it.skip('Should redirect to choosing sender options when a version is chosen correctly', async function () {
    browser.choose('SFT version 2.2.1');
    await browser.pressButton('Save and continue');
    browser.assert.redirected('Page should have moved onto the sender options screen');
    browser.assert.url(`${baseLink}choose-sender-options`, 'Page should be showing sender options');
  });

  it.skip('Should generate a new token with agent version in it', async function () {
    browser.choose('SFT version 2.2.1');
    await browser.pressButton('Save and continue');
    const token = await decodeToken(browser.getCookie('route-options'));
    expect(token).to.have.own.property('route');
    expect(token.route).to.have.own.property('agent_version');
    expect(token.route.agent_version).to.equal('2.2.1/jre8');
  });

  it.skip('Should handle an existing empty token and update the agent version in it', async function () {
    await generateSignature(browser, 'route-options', {});
    await refreshPage(browser, introLink);
    browser.choose('SFT version 2.2.1');
    await browser.pressButton('Save and continue');
    const token = await decodeToken(browser.getCookie('route-options'));
    expect(token).to.have.own.property('route');
    expect(token.route).to.have.own.property('agent_version');
    expect(token.route.agent_version).to.equal('2.2.1/jre8');
  });

  it.skip('Should overwrite an existing token with a new agent version in it', async function () {
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

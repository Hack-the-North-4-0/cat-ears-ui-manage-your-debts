const Zombie = require('zombie');

const baseLink = 'http://localhost:9090/';

describe('The basic page', function () {
  const browser = new Zombie();

  before(async function () {
    await refreshPage(browser, baseLink);
  });

  describe('homepage',  function () {
    afterEach(async function () {
      browser.deleteCookies();
      await refreshPage(browser, baseLink);
    });

    it('should load the web service', function () {
      browser.assert.success();
    });

    describe('Navigation', function () {
      afterEach(async function () {
        await refreshPage(browser, baseLink);
      });

      it('Should have a link to this page in the heading icon', async function () {
        await browser.clickLink('a.govuk-header__link--homepage');
        expect(browser.url).to.equal(baseLink);
      });

      it('Should have a link to this page in the heading text', async function () {
        await browser.clickLink('a.govuk-header__link--service-name');
        expect(browser.url).to.equal(baseLink);
      });

      it('Should have a link to the glossary in the header', async function () {
        await browser.clickLink('Glossary');
        expect(browser.url).to.equal(`${baseLink}glossary`);
      });

      it.skip('Should have a link to the action repository in the header', async function () {
        await browser.clickLink('Plugin repository');
        expect(browser.url).to.equal(`${baseLink}plugin-repository`);
      });
    });

    describe('Active content', function () {
      afterEach(async function () {
        browser.deleteCookies();
        await refreshPage(browser, baseLink);
      });

      it('Should start with a start now button', function () {
        const startButton = browser.link('Start now');
        expect(startButton, 'Button should be present on page').is.not.null;
        expect(startButton.href).equals(`${baseLink}create-journey`);
      });

      it('Should stay with start now for an empty cookie', async function () {
        browser.setCookie('route-options', '');
        await refreshPage(browser, baseLink);
        const startButton = browser.link('Start now');
        expect(startButton, 'Button should be present on page').is.not.null;
        expect(startButton.href).equals(`${baseLink}create-journey`);
      });

      it('Should move to a resume button when a route has been started', async function () {
        await generateSignature(browser, 'route-options', { route: {}});
        await refreshPage(browser, baseLink);
        const resumeButton = browser.link('Resume');
        expect(resumeButton, 'Button should be present on page').is.not.null;
        expect(resumeButton.href).equals(`${baseLink}create-journey`);
      });

      it('Should redirect through the create-journey page to a new journey', async function () {
        await browser.clickLink('Start now');
        browser.assert.redirected('Browser should have been redirected through this journey');
        browser.assert.url(`${baseLink}choose-version`, 'A new journey should be started');
      })
    });
  });
});

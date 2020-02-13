const appLocation = '../../../src/app';

describe('the application on http/s', function () {
  before(function () {
    process.env.ALLOW_CONFIG_MUTATIONS = 'true';
    process.env.NODE_CONFIG = JSON.stringify(require('../../../config/test'));
    const testConfig = importFresh('config');
    expect(
        testConfig.get('app.http2.enabled'),
        'http2 should be disabled',
    ).to.equal(false);
    startMockRequire('config', testConfig);
  });

  after(function () {
    stopMockRequire('config');
  });

  describe('basic pages', function () {
    afterEach(function () {
      clearModule(appLocation);
    });

    it('should be reachable through HTTP', function (done) {
      request(testRequire(appLocation))
        .get('/')
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.html;
          done();
        });
    });
  });

  describe('error pages', function () {
    afterEach(function () {
      clearModule(appLocation);
    });

    it('should display a 404 page for non-existent URLs', function (done) {
      request(testRequire(appLocation))
        .get('/this-path-will-never-exist')
        .then((response) => {
          expect(response).to.have.status(404);
          expect(response).to.be.html;
          done();
        });
    });
  });
});

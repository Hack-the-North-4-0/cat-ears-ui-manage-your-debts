const setupNocks = (nock) => {
  const nocks = [];
  nocks.push(nock.get('/schemas/actions')
    .reply(200, [
      require('./schemas/actions/writeFile/action.meta'),
    ]));
  nocks.push(nock.get('/schemas/actions/writeFile')
    .reply(200, [
      {
        version: '2.2.1',
        jre_version: 'jre8',
      },
    ]));
  nocks.push(nock.get('/schemas/actions/writeFile/2.2.1/jre8')
    .reply(200, require('./schemas/actions/writeFile/action.schema')));
  return nocks;
};

module.exports = setupNocks;

const setupNocks = (nock) => {
  const nocks = [];
  nocks.push(nock.get('/schemas/agent')
    .reply(200, [
      {
        version: '2.2.1',
        jre_version: 'jre8',
      },
    ]));
  nocks.push(nock.get('/schemas/agent/2.2.1/jre8')
    .reply(200, require('./schemas/agents/agent.schema')));
  nocks.push(nock.get('/schemas/agent/2.2.1/jre8/sender')
    .reply(200, require('./schemas/agents/agent.sender.schema')));
  nocks.push(nock.get('/schemas/agent/2.2.1/jre8/receiver')
    .reply(200, require('./schemas/agents/agent.receiver.schema')));
  nocks.push(nock.get('/schemas/agent/2.2.1/jre8/action')
    .reply(200, require('./schemas/agents/agent.action.schema')));

  nocks.push(nock.get('/schemas/agent/1.0.0/jre8/sender')
    .reply(404, { status: 404, message: '/schemas/agent/1.0.0/jre8/sender does not exist' }));
  return nocks;
};

module.exports = setupNocks;

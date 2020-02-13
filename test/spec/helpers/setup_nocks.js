const nock = require('nock');
const config = require('config');

const baseLink = `${config.get('externals.action_marketplace.base_url')}`;
const nocks = [];

const centralNock = nock(baseLink, { allowUnmocked: true }).persist(true);

nocks.push(...require('./nocks/nock-agent-schemas')(centralNock));
nocks.push(...require('./nocks/nock-action-schemas')(centralNock));

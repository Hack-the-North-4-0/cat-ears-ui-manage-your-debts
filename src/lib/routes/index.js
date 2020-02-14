const assetRoutes = require('./assets');
const homepageRoutes = require('./homepage');

const viewoneCreditor = require('./view-one-creditor');

module.exports = (server) => {
  assetRoutes(server);
  viewoneCreditor(server);
  homepageRoutes(server);
  return server;
};

const assetRoutes = require('./assets');
const homepageRoutes = require('./homepage');

module.exports = (server) => {
  assetRoutes(server);
  homepageRoutes(server);
  return server;
};

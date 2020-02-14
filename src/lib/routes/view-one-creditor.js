const renderer = require('../renderer').nunjucksRenderer();

const renderWongaResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text/html');
  res.send(200, renderer.render('pages/view-wonga-creditor.njk', {...res.nunjucks}));
  next();
};

module.exports = (server) => {
  server.get('/debt/wonga', renderWongaResponse);
  server.get('/debt/barclaycard', renderWongaResponse);
  server.get('/debt/msfinance', renderWongaResponse);
};

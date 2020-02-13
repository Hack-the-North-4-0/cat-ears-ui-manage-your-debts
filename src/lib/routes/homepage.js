const renderer = require('../renderer').nunjucksRenderer();

const renderResponse = (req, res, next) => {
  res.contentType = 'text/html';
  res.header('content-type', 'text/html');
  res.send(200, renderer.render('pages/homepage.njk', {...res.nunjucks}));
  next();
};

module.exports = (server) => {
  server.get('/', renderResponse);
};

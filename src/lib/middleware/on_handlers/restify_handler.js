const renderer = require('../../renderer').nunjucksRenderer();

const restifyHandler = (req, res, err, callback) => {
  req.log.info(`Error thrown within restify: ${err}`);
  res.header('content-type', 'text/html');
  err.toHTML = () => renderer.render('pages/error.njk', { error: err });
  err.toJSON = () => ({
    message: err.message,
    statusCode: res.statusCode,
  });
  return callback();
};

module.exports = restifyHandler;

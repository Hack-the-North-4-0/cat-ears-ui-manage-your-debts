const path = require('path');
const nunjucks = require('nunjucks');
const config = require('config');
const metadata = require('../../../package');

let renderer;

const createRenderer = () => {
  const nunjucksEnv = new nunjucks.Environment([
    new nunjucks.FileSystemLoader(path.join(process.cwd(), '/src/views')),
    new nunjucks.FileSystemLoader(path.join(process.cwd(), 'node_modules/govuk-frontend/govuk')),
    new nunjucks.FileSystemLoader(path.join(process.cwd(), 'node_modules/govuk-frontend/govuk/components')),
  ], config.get('nunjucks.options'));
  nunjucksEnv.addGlobal('functionality', config.get('functionality'));
  nunjucksEnv.addGlobal('metadata', metadata);
  return nunjucksEnv;
};

module.exports = () => {
  if (renderer === undefined) {
    renderer = createRenderer();
  }
  return renderer;
};

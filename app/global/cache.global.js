const NodeCache = require('node-cache');
const productCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = {
  productCache,
};
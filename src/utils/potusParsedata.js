const rp = require('request-promise');
const $ = require('cheerio');

const potusParsedeep = function(url) {
    //console.log(options.url)
    return rp(url)
      .then(function(html) {
        const product = JSON.parse($('div.relative', html)[0].attribs['data-product'].toString().replace(/[']/g, '"'))
        return {
          ProductId: product.ProductId,
          RegularPrice: product.RegularPrice
        }
      },5000)
      .catch(function(err) {
        //handle error
      })
  }

  
module.exports = potusParsedeep
const rp = require('request-promise');
const $ = require('cheerio');

const list = []

const potusParse = function(url) {
  return rp(url)
    
    .then(function(html) {
      let size = $('div.item-product.js-product.js-equalized.js-addtolist-container.js-ga', html).length
      
      for (let i = 0; i < size; i++) {
        list.push('https://www.iga.net/'+JSON.parse($('div.item-product.js-product.js-equalized.js-addtolist-container.js-ga', html)[i].attribs['data-product'].toString().replace(/[']/g, '"')).ProductUrl+'?page=1&pageSize=20000')
      }

      return list
    })
    .catch(function(err) {
      //handle error
    })
}

module.exports = potusParse
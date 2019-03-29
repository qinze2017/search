const express = require('express')
const path = require('path')
const http = require('http')
const rp = require('request-promise')
const $ = require('cheerio')
const fs = require('fs')

const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 3000

const saveNotes = (notes) => {

  const dataJSON = JSON.stringify(notes)
  fs.appendFileSync('notes.json', dataJSON)
}


const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

const potusParse = require('../src/utils/potusParse')
const potusParsedeep = require('../src/utils/potusParsedata')

const url = 'https://www.iga.net/fr/epicerie_en_ligne'

var options = {
    url,
    headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
    },
    json: true// Automatically parses the JSON string in the response
   
};



rp(options)
    .then(function (html) {
        const wikiUrls = []
        var wikiUrlsdeep = []

        let size = $('.js-ga-category', html).length
        //console.log($('.js-ga-category', html)[0].attribs.href)

        for (let i = 0; i < size; i++) {
            wikiUrls.push( $('.js-ga-category', html)[i].attribs.href)
        }

        //console.log(wikiUrls)
        
        const p = Promise.all(
            wikiUrls.map(function(url) {
                //console.log(url)
                return potusParse('https://www.iga.net/' + url)
            })
        ).then(values => {
            //console.log(values[values.length-1].toString().split(','))
            //console.log(values)
            if (typeof values[values.length-1] !== "undefined") {
                values[values.length-1].toString().split(',').forEach(element => {
                    potusParsedeep(element).then(val => {
                        //console.log(val)
                        if (typeof val !== "undefined" && val) {
                            //console.log(val)
                            saveNotes(val)
                        }
                    })
                },2000)
            } 
        }).catch((error) => {
            console.log(error)
        })
    },5000)
    .then(function (presidents) {
        //console.log(presidents)
    })
    .catch(function (err) {
        //handle error
        console.log(err);
    })

server.listen(port, () => {
    console.log('Server port : ' + port)
})
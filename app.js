const express = require('express');
const app = express();
const port = 3000;
let Xray = require('x-ray');
let x = Xray();

let BASE_URL = 'https://www.whisky.com/whisky-database/bottle-search/fdb/Bottles/search.html?type=1505224767&tx_datamintsflaschendb_pi4%5BsearchCriteria%5D%5BsortingCombined%5D=bewertungsAnzahl_descending&tx_datamintsflaschendb_pi4%5BcurPage%5D='
let END_URL = '1&tx_datamintsflaschendb_pi4%5BresultsOnly%5D=1L';

app.listen(port, (err) => {

    let MongoClient = require('mongodb').MongoClient;
    let url = "mongodb://localhost:27017/";

    for(let i = 0; i < 200; i ++) {


        x (BASE_URL + i + END_URL,{ title: '.marke', year: '.alterEtikett', alc: '.alkoholgehalt', link: 'a@href'})(function(err,obj) {
            MongoClient.connect(url, function(err, db) {

                let dbo = db.db("kirill");
                let myobj = { title: obj.title, year: obj.year, alc: obj.alc, link: obj.link };

                dbo.collection("whiskey").insertOne(myobj, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    db.close();
                });
            });
        })
    }
});
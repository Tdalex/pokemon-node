const mongoose      = require("mongoose"),
    express    = require('express'),
    app        = module.exports               = express(),
    fetch      = require("node-fetch"),
    cheerio    = require("cheerio"),
    jsonframe  = require("jsonframe-cheerio"),
    download   = require("image-downloader"),
    passport   = require('passport'),
    bodyParser = require('body-parser');


mongoose.connect("mongodb://localhost/pokedex");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


require("./routing/pokemon");
require("./routing/user");

app.listen(3000);
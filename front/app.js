const mongoose = require("mongoose");
const fetch      = require("node-fetch");
const cheerio    = require("cheerio");
const jsonframe  = require("jsonframe-cheerio");
const download   = require("image-downloader");
const express    = require('express');
const passport   = require('passport');
const jwt        = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app        = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");

app.get('/pokemons', (req, res) => {
    fetch("http://localhost:3000/pokemons")
    .then(Pokemon.find((err, pokemons) => {
        if (err){
            console.log(err);
            res.json({"success": false, "error": err});
        } else {
            console.log(pokemons);
            res.render("home", {pokemons: pokemons});
        }
    }));
});

app.get('/pokemons/:id', (req, res) => {
    fetch("http://localhost:3000/pokemons/:id")
    .then(Pokemon.findOne({ 'numero': req.params.id }, (err, pokemons) => {
        if (err){
            console.log(err);
            res.json({"success": false, "error": err});
        } else {
            console.log(pokemons);
            res.render("show", {pokemons: pokemons});
        }
    }));
});

app.listen(3001);
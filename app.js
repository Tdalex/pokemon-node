const mongoose = require("mongoose");
const fetch     = require("node-fetch");
const cheerio   = require("cheerio");
const jsonframe = require("jsonframe-cheerio");
const download  = require("image-downloader");
const express   = require('express');
const jwt       = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express();

mongoose.connect("mongodb://localhost/pokedex");
app.use(bodyParser.urlencoded({extended: true}));

const pokemonSchema = mongoose.Schema({
    _id      : String,
    name     : String,
    types    : [{type: String}],
    niveau   : String,
    img      : String,
    evolution: [{ niveau: Number, name: String}]
});

const pokemon = mongoose.model("pokemon", pokemonSchema);

const userSchema = mongoose.Schema( {
    _id             : String,
    name            : String,
    email           : String,
    password        : String,
    pokemonsCaptures: [{_idPokemeon: String}]
  });
const user = mongoose.model("user", userSchema);


// liste tous les pokemons
app.get('/pokemons', function(req, res){
    res.send('hello world');
});

// recupere un pokemon
app.get('/pokemons/:id', function(req, res){
    res.send('pokemon ' + req.params.id);
});

// ajoute un pokemon
app.post('/pokemons', function(req, res){
    res.send('hello world');
});

// modifie un pokemon
app.put('/pokemons/:id', function(req, res){
    res.send('hello world');
});

// modifie un champ d'un pokemon
app.patch('/pokemons/:id', function(req, res){
    res.send('hello world');
});

// supprime un pokemon
app.delete('/pokemons/:id', function(req, res){
    res.send('hello world');
});







app.listen(3000);
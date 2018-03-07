const mongoose = require("mongoose");
const fetch      = require("node-fetch");
const cheerio    = require("cheerio");
const jsonframe  = require("jsonframe-cheerio");
const download   = require("image-downloader");
const express    = require('express');
const jwt        = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app        = express();

mongoose.connect("mongodb://localhost/pokedex");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const pokemonSchema = mongoose.Schema({
    _id      : Number,
    name     : String,
    types    : [{type: String}],
    niveau   : Number,
    img      : String,
    evolution: [{ niveau: Number, _id: Number}]
});

const Pokemon = mongoose.model("pokemon", pokemonSchema);

const userSchema = mongoose.Schema( {
    _id             : Number,
    name            : String,
    email           : String,
    password        : String,
    pokemonsCaptures: [{_idPokemeon: Number}]
  });
const User = mongoose.model("user", userSchema);


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
    // console.log(req.body);
    let query      = req.body;
    let id         = query.id;
    let evolutions = [];
    query.evolution.forEach(async el => {
        evolutions.push({'niveau': el.niveau, '_id': el.id});
    });

    let newPokemon = {
        _id      : id,
        name     : query.name,
        types    : query.types,
        niveau   : query.niveau,
        img      : './img/' . id,
        evolution: evolutions
      };

    res.send(query);
    Pokemon.create( newPokemon, (err, doc) => {
        if (err) console.log(err);
        console.log("pokemon créer", doc);
      });

    res.send(query);
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
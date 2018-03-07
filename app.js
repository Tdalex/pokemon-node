const mongoose = require("mongoose");
const fetch     = require("node-fetch");
const cheerio   = require("cheerio");
const jsonframe = require("jsonframe-cheerio");
const download  = require("image-downloader");
const express   = require('express');
const jwt       = require('jsonwebtoken');

mongoose.connect("mongodb://localhost/pokedex");


const pokemonSchema = mongoose.Schema({
    nom    : String,
    prenom : String,
    age    : Number,
    address: String
  });

const pokemon = mongoose.model("pokemon", pokemonSchema);

// js



// js
// const pokemons = {
//   _id,
//   name,
//   type,
//   niveau,
//   img,
//   evolution: [{ niveauEvolution, evolutionName }]
// };




const userSchema = mongoose.Schema( {
    _id,
    name,
    email,
    password,
    pokemonsCaptures: [_idPokemeon]
  });
const user = mongoose.model("user", userSchema);


const app = express();

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
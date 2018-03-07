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
    Pokemon.find((err, pokemons) => {
        if (err){
            console.log(err);
            res.send(err);
        } else {
            console.log(pokemons);
            res.send(pokemons);
        }
    });
});

// recupere un pokemon
app.get('/pokemons/:id', function(req, res){
    Pokemon.findOne({ '_id': req.params.id }, (err, pokemons) => {
        if (err){
            console.log(err);
            res.send(err);
        } else {
            console.log(pokemons);
            res.send(pokemons);
        }
    });
});

// ajoute un pokemon
app.post('/pokemons', function(req, res){
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
        img      : './img/' + id + '.png',
        evolution: evolutions
      };

    Pokemon.create(newPokemon, (err, doc) => {
        if (err){
            console.log(err)
            res.send(err);
        } else{
            console.log(query.name + " ajouté dans le pokedex", doc);
            res.send(query.name + " ajouté dans le pokedex");
        }
      });
});

// modifie un pokemon
app.put('/pokemons/:id', function(req, res){
    let query      = req.body;
    let id         = query.id;
    let evolutions = [];
    query.evolution.forEach(async el => {
        evolutions.push({'niveau': el.niveau, '_id': el.id});
    });

    let editPokemon = {
        _id      : id,
        name     : query.name,
        types    : query.types,
        niveau   : query.niveau,
        img      : './img/' + id + '.png',
        evolution: evolutions
      };

    id = req.params.id;

    Pokemon.update({_id  : ObjectId(id)}, {$set: editPokemon});
    res.send('hello world');
});

// modifie un champ d'un pokemon
app.patch('/pokemons/:id', function(req, res){
    let query         = req.body;
    let evolutions    = [];
    let updatePokemon = {};

    if(query.evolutions !== undefined){
        query.evolution.forEach(async el => {
            evolutions.push({'niveau': el.niveau, '_id': el.id});
        });
    }

    if(query.name !== undefined){
        updatePokemon.name = query.name;
    }

    if(evolutions.length > 0){
        updatePokemon.evolution = evolutions;
    }

    if(query.id !== undefined){
        updatePokemon._id = query.id;
        updatePokemon.img = './img/' + query.id + '.png';
    }

    if(query.types !== undefined){
        updatePokemon.types = query.types;
    }

    if(query.niveau !== undefined){
        updatePokemon.niveau = query.niveau;
    }

    Pokemon.update({_id  : req.params.id}, {$set: updatePokemon}, function(err, doc) {
        if (err){
            console.log(err)
            res.send(err);
        } else{
            console.log(updatePokemon);
            res.send(updatePokemon);
        }
      });
});

// supprime un pokemon
app.delete('/pokemons/:id', function(req, res){
    res.send('hello world');
});

app.listen(3000);
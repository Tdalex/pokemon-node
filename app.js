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

mongoose.connect("mongodb://localhost/pokedex");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const pokemonSchema = mongoose.Schema({
    numero   : Number,
    name     : String,
    types    : [{type: String}],
    niveau   : Number,
    img      : String,
    evolution: [{ niveau: Number, numero: Number}]
});

const Pokemon = mongoose.model("pokemon", pokemonSchema);

const userSchema = mongoose.Schema( {
    name            : String,
    email           : String,
    password        : String,
    pokemonsCaptures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }]
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
    Pokemon.findOne({ 'numero': req.params.id }, (err, pokemons) => {
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
    let id         = query.numero;
    let evolutions = [];
    query.evolution.forEach(async el => {
        evolutions.push({'niveau': el.niveau, 'numero': el.numero});
    });

    let newPokemon = {
        numero   : id,
        name     : query.name,
        types    : query.types,
        niveau   : query.niveau,
        img      : query.img,
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
    let id         = query.numero;
    let evolutions = [];
    query.evolution.forEach(async el => {
        evolutions.push({'niveau': el.niveau, 'numero': el.numero});
    });

    let editPokemon = {
        numero   : id,
        name     : query.name,
        types    : query.types,
        niveau   : query.niveau,
        img      : query.img,
        evolution: evolutions
      };

    Pokemon.update({numero  : req.params.id}, {$set: editPokemon}, function(err, doc) {
        if (err){
            console.log(err)
            res.send(err);
        } else{
            console.log(editPokemon);
            res.send({'success': true});
        }
    });
});

// modifie un champ d'un pokemon
app.patch('/pokemons/:id', function(req, res){
    let query         = req.body;
    let evolutions    = [];
    let updatePokemon = {};

    if(query.evolutions !== undefined){
        query.evolution.forEach(async el => {
            evolutions.push({'niveau': el.niveau, 'numero': el.numero});
        });
    }

    if(query.name !== undefined){
        updatePokemon.name = query.name;
    }

    if(evolutions.length > 0){
        updatePokemon.evolution = evolutions;
    }

    if(query.numero !== undefined){
        updatePokemon.numero = query.numero;
    }

    if(query.img !== undefined){
        updatePokemon.img = query.img;
    }

    if(query.types !== undefined){
        updatePokemon.types = query.types;
    }

    if(query.niveau !== undefined){
        updatePokemon.niveau = query.niveau;
    }

    Pokemon.update({numero  : req.params.id}, {$set: updatePokemon}, function(err, doc) {
        if (err){
            console.log(err)
            res.send(err);
        } else{
            console.log(updatePokemon);
            res.send({'success': true});
        }
    });
});

// supprime un pokemon
app.delete('/pokemons/:id', function(req, res){
    Pokemon.findOne({ 'numero': req.params.id }, (err, pokemon) => {
        if (err){
            console.log(err);
            res.send(err);
        } else {
            let name = pokemon.name;
            pokemon.remove();
            res.send(name + " a été supprimé");
        }
    });
});

// liste tous les users
app.get('/users', function(req, res){
    User.find((err, users) => {
        if (err){
            console.log(err);
            res.send(err);
        } else {
            console.log(users);
            res.send(users);
        }
    });
});

// ajoute un user
app.post('/users', function(req, res){
    let query = req.body;

    let newUser = {
        name            : query.name,
        email           : query.email,
        password        : query.password,
        pokemonsCaptures: []
      };

    User.create(newUser, (err, doc) => {
        if (err){
            console.log(err)
            res.send(err);
        } else{
            res.send({"success": true});
        }
      });
});

// recupere les pokemons d'un user
app.get('/users/:id/pokemons', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            User.findOne({ '_id': req.params.id }, 'pokemonsCaptures', (err, pokemons) => {
                if (err){
                    console.log(err);
                    res.send(err);
                } else {
                    Pokemon.find({ '_id': { "$in" : pokemons.pokemonsCaptures} }, (err, pokemons) => {
                        if (err){
                            console.log(err);
                            res.send(err);
                        } else {
                            res.send(pokemons);
                        }
                    });
                    // res.send(pokemons.pokemonsCaptures);
                }
            });
        }
    });
});


// ajoute un user
app.post('/users', function(req, res){
    let query = req.body;

    let newUser = {
        name            : query.name,
        email           : query.email,
        password        : query.password,
        pokemonsCaptures: []
      };

    User.create(newUser, (err, doc) => {
        if (err){
            console.log(err)
            res.send(err);
        } else{
            res.send({"success": true});
        }
      });
});

// ajoute un pokemon a un user
app.post('/users/:id/pokemons', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            User.findOne({ '_id': req.params.id }, 'pokemonsCaptures', (err, pokemons) => {
                if (err){
                    console.log(err);
                    res.send(err);
                } else {
                    let userPokemons = pokemons.pokemonsCaptures;
                    let poke         = userPokemons.concat(req.body.pokemonsCaptures);

                    User.update({_id  : req.params.id}, {$set: {pokemonsCaptures: poke}}, function(err, doc) {
                        if (err){
                            console.log(err)
                            res.send(err);
                        } else{
                            res.send({'success': true});
                        }
                    });
                }
            });
        }
    });
});

// recupere un pokemon d'un user
app.get('/users/:id/pokemons/:pokeId', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            Pokemon.findOne({ '_id': req.params.pokeId }, (err, pokemons) => {
                if (err){
                    console.log(err);
                    res.send(err);
                } else {
                    console.log(pokemons);
                    res.send(pokemons);
                }
            });
        }
    });
});

// recuperation du token
app.post('/users/login', (req, res) => {
    const user = req.body;

    jwt.sign({user}, 'secretkey', { expiresIn: '24h' }, (err, token) => {
        res.json({token});
    });
});


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      const bearer      = bearerHeader.split(' ');
      const bearerToken = bearer[1];
            req.token   = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
}

app.listen(3000);
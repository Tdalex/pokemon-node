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

const Pokemon         = mongoose.model("pokemon", pokemonSchema);
const CapturedPokemon = mongoose.model("capturedPokemon", pokemonSchema);

const userSchema = mongoose.Schema( {
    name            : String,
    email           : String,
    password        : String,
    pokemonsCaptures: [{ type: mongoose.Schema.Types.ObjectId, ref: "capturedPokemonSchema" }]
  });
const User = mongoose.model("user", userSchema);


// liste tous les pokemons
app.get('/pokemons', function(req, res){
    Pokemon.find((err, pokemons) => {
        if (err){
            console.log(err);
            res.json({"success": false, "error": err});
        } else {
            console.log(pokemons);
            res.json(pokemons);
        }
    });
});

// recupere un pokemon
app.get('/pokemons/:id', function(req, res){
    Pokemon.findOne({ 'numero': req.params.id }, (err, pokemons) => {
        if (err){
            console.log(err);
            res.json({"success": false, "error": err});
        } else {
            console.log(pokemons);
            res.json(pokemons);
        }
    });
});

// ajoute un pokemon
app.post('/pokemons', function(req, res){
    let query = req.body;

    Pokemon.create(query, (err, doc) => {
        if (err){
            console.log(err)
            res.json({"success": false, "error": err});
        } else{
            console.log(query.name + " ajouté dans le pokedex", doc);
            res.json(query.name + " ajouté dans le pokedex");
        }
    });
});

// modifie un pokemon
app.put('/pokemons/:id', function(req, res){
    let query = req.body;

    Pokemon.update({numero  : req.params.id}, {$set: query}, function(err, doc) {
        if (err){
            console.log(err)
            res.json({"success": false, "error": err});
        } else{
            console.log(query);
            res.json({"success": true});
        }
    });
});

// modifie un champ d'un pokemon
app.patch('/pokemons/:id', function(req, res){
    let query = req.body;

    Pokemon.update({numero  : req.params.id}, {$set: query}, function(err, doc) {
        if (err){
            console.log(err)
            res.json({"success": false, "error": err});
        } else{
            console.log(query);
            res.json({"success": true});
        }
    });
});

// supprime un pokemon
app.delete('/pokemons/:id', function(req, res){
    Pokemon.findOne({ 'numero': req.params.id }, (err, pokemon) => {
        if (err){
            console.log(err);
            res.json({"success": false, "error": err});
        } else {
            let name = pokemon.name;
            pokemon.remove();
            res.json(name + " a été supprimé");
        }
    });
});

// liste tous les users
app.get('/users', function(req, res){
    User.find((err, users) => {
        if (err){
            console.log(err);
            res.json({"success": false, "error": err});
        } else {
            console.log(users);
            res.json(users);
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
            res.json({"success": false, "error": err});
        } else{
            res.json({"success": true});
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
                    res.json({"success": false, "error": err});
                } else {
                    CapturedPokemon.find({ '_id': { "$in" : pokemons.pokemonsCaptures} }, (err, pokemons) => {
                        if (err){
                            console.log(err);
                            res.json({"success": false, "error": err});
                        } else {
                            res.json(pokemons);
                        }
                    });
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
            res.json({"success": false, "error": err});
        } else{
            res.json({"success": true});
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
                    res.json({"success": false, "error": err});
                } else {
                    let userPokemons = pokemons.pokemonsCaptures;
                    Pokemon.findOne({ 'numero': req.body.pokemonsCaptures }, (err, pokemon) => {
                        if (err){
                            console.log(err);
                            res.json({"success": false, "error": err});
                        } else {
                            let newPoke = {
                                numero   : pokemon.numero,
                                name     : pokemon.name,
                                types    : pokemon.types,
                                niveau   : pokemon.niveau,
                                img      : pokemon.img,
                                evolution: pokemon.evolution
                            };

                            CapturedPokemon.create(newPoke, (err, pokemon) => {
                                if (err){
                                    console.log(err);
                                    res.json({"success": false, "error": err});
                                } else{
                                    let poke = userPokemons.concat([pokemon._id]);
                                    User.update({_id  : req.params.id}, {$set: {pokemonsCaptures: poke}}, function(err, doc) {
                                        if (err){
                                            console.log(err)
                                            res.json({"success": false, "error": err});
                                        } else{
                                            res.json({"success": true});
                                        }
                                    });
                                }
                            });
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
            CapturedPokemon.findOne({ '_id': req.params.pokeId }, (err, pokemons) => {
                if (err){
                    console.log(err);
                    res.json({"success": false, "error": err});
                } else {
                    console.log(pokemons);
                    res.json(pokemons);
                }
            });
        }
    });
});

// modifie un pokemon d'un user
app.put('/users/:id/pokemons/:pokeId', verifyToken, function(req, res){
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            let query = req.body;

            CapturedPokemon.update({'_id'  : req.params.pokeId}, {$set: query}, function(err, doc) {
                if (err){
                    console.log(err)
                    res.json({"success": false, "error": err});
                } else{
                    console.log(query);
                    res.json({"success": true});
                }
            });
        }
    });
});

// modifie un champ d'un pokemon d'un user
app.patch('/users/:id/pokemons/:pokeId', verifyToken, function(req, res){
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            let query = req.body;

            CapturedPokemon.update({'_id'  : req.params.pokeId}, {$set: query}, function(err, doc) {
                if (err){
                    console.log(err)
                    res.json({"success": false, "error": err});
                } else{
                    console.log(query);
                    res.json({"success": true});
                }
            });
        }
    });
});

// supprime un pokemon d'un user
app.delete('/users/:id/pokemons/:pokeId', verifyToken, function(req, res){
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            User.findOne({ '_id': req.params.id }, 'pokemonsCaptures', (err, pokemons) => {
                if (err){
                    console.log(err);
                    res.json({"success": false, "error": err});
                } else {
                    let error        = [];
                    let userPokemons = pokemons.pokemonsCaptures;
                    CapturedPokemon.findOne({ '_id': req.params.pokeId }, (err, pokemon) => {
                        if (err){
                            console.log(err);
                            error.push(err);
                        } else {
                            if( pokemon !== null)
                                pokemon.remove();
                        }
                    });

                    for (var key in userPokemons) {
                        if (userPokemons[key] == req.params.pokeId) {
                            userPokemons.splice(key, 1);
                        }
                    }
                    User.update({'_id'  : req.params.id}, {$set: {'pokemonsCaptures': userPokemons}}, function(err, doc) {
                        if (err){
                            console.log(err);
                            error.push(err);
                        } else{
                            res.json({"success": true});
                        }
                    });
                    if (error.length > 0){
                        res.json({"success": false, "error": error});
                    }
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
var app = require('../api');

const Pokemon = require('../models/Pokemon');

// liste tous les pokemons
app.get('/pokemons', function(req, res){
    Pokemon.find({}, (err, pokemons) => {
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

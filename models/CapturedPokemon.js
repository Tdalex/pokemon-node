var mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
    numero   : Number,
    name     : String,
    types    : [{type: String}],
    niveau   : Number,
    img      : String,
    evolution: [{ niveau: Number, numero: Number}]
});

module.exports = mongoose.model("capturedPokemon", pokemonSchema);
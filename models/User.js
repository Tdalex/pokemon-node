var mongoose = require("mongoose");

const userSchema = new mongoose.Schema( {
    name            : String,
    email           : String,
    accessToken     : String,
    password        : String,
    pokemonsCaptures: [{ type: mongoose.Schema.Types.ObjectId, ref: "capturedPokemonSchema" }]
  });
module.exports = mongoose.model("user", userSchema);
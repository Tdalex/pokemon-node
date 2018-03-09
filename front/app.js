const mongoose = require("mongoose"),
      fetch           = require("node-fetch"),
      bodyParser      = require('body-parser'),
      express         = require('express'),
      app             = express(),
      methodOverride  = require("method-override");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.set("view engine", "ejs");

app.get('/pokemons', (req, res) => {
    console.log('res: ' +res);
    fetch("http://localhost:3000/pokemons")
    .then(res => res.json())
    .then((json) => {
            console.log(json);
            res.render("home", {pokemons: json});  
    });
});

app.get('/pokemons/new', (req, res) => {
    fetch('http://localhost:3000/pokemons/new')
    .then(( ) => {
            res.render("new");     
    })
});

app.post('/pokemons', (req, res) => {
    console.log(req.body)
     fetch('http://localhost:3000/pokemons', {
         method: "POST",
         headers : {
             'Accept': 'applicaton/json',
             'Content-Type': 'application/json'
         },
          body: JSON.stringify(req.body)
        })
        .then(res => res.json())
        .then((json) => {
                console.log(json);
                res.redirect("/pokemons");  
        });
});

app.delete('/pokemons/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    fetch('http://localhost:3000/pokemons/'+ id, {
        method: "DELETE",
        headers : {
            'Accept': 'applicaton/json',
            'Content-Type': 'application/json'
        },
         body: JSON.stringify(req.body)
    })
    .then(res => res.json())
    .then((json ) => {
            console.log(json);
            res.redirect("/pokemons");     
    })
})

app.get('/pokemons/:id', (req, res) => {
    const id = req.params.id;
    fetch('http://localhost:3000/pokemons/'+ id)
    .then(res => res.json())
    .then((json ) => {
            console.log(json);
            res.render("show", {pokemon: json});     
    })
});

app.listen(3001);
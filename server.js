require('dotenv').config();
const { default: axios } = require('axios');
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const API_KEY = process.env.API_KEY
const db = require('./models')
// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
//home route
app.get('/', function(req, res) {
  res.render('index.ejs')
});

//get route
app.get('/results', (req,res) =>{
  console.log(req.query)
  axios.get(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${req.query.results}`)
  .then(response => {
    console.log(response.data)
    res.render('results.ejs' , {movies:response.data.Search})
  })
})

//show route
app.get('/movies/:movieid', (req, res)=>{
  console.log(req.params.movieid)
  axios.get(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${req.params.movieid}`)
  .then(response => {
    console.log(response.data)
    res.render('detail.ejs', {movie:response.data})
  })
})

app.get('/faves', (req,res)=>{
  db.faves.findAll().then(faves =>{
    console.log(faves)
    res.render('faves', {faves})
  })
})


app.post('/faves', (req,res)=>{
  db.faves.create(req.body).then(createdFave =>{
    console.log(createdFave)
    redirect('/faves')
  }) 
})

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);


// We can export this server to other servers like this
module.exports = server;

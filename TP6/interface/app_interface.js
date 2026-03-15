const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const API_URL = process.env.API_URL || 'http://localhost:7789';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// GET /
app.get('/', function(req, res) {
  res.redirect('/filmes');
});

// GET /filmes
app.get('/filmes', function(req, res) {
  axios.get(API_URL + '/filmes')
    .then(response => {
      const filmes = response.data.map(f => ({
        id: f.id,
        title: f.title,
        year: f.year,
        nAtores: Array.isArray(f.cast) ? f.cast.length : 0,
        nGeneros: Array.isArray(f.genres) ? f.genres.length : 0
      }));
      res.render('filmes', { title: 'Filmes', filmes });
    })
    .catch(err => {
      res.status(500).render('error', { message: 'Erro ao obter filmes', error: err });
    });
});

// GET /filmes/:id
app.get('/filmes/:id', function(req, res) {
  axios.get(API_URL + '/filmes/' + req.params.id)
    .then(response => {
      res.render('filme', { title: 'Filme', filme: response.data });
    })
    .catch(err => {
      const code = err.response ? err.response.status : 500;
      res.status(code).render('error', { message: 'Filme não encontrado', error: err });
    });
});

// GET /atores
app.get('/atores', function(req, res) {
  axios.get(API_URL + '/atores')
    .then(response => {
      const atores = response.data.map(a => ({
        id: a.id,
        name: a.name,
        nFilmes: Array.isArray(a.films) ? a.films.length : 0
      }));
      res.render('atores', { title: 'Atores', atores });
    })
    .catch(err => {
      res.status(500).render('error', { message: 'Erro ao obter atores', error: err });
    });
});

// GET /atores/:id
app.get('/atores/:id', function(req, res) {
  axios.get(API_URL + '/atores/' + req.params.id)
    .then(response => {
      res.render('ator', { title: 'Ator', ator: response.data });
    })
    .catch(err => {
      const code = err.response ? err.response.status : 500;
      res.status(code).render('error', { message: 'Ator não encontrado', error: err });
    });
});

// GET /generos
app.get('/generos', function(req, res) {
  axios.get(API_URL + '/generos')
    .then(response => {
      const generos = response.data.map(g => ({
        id: g.id,
        name: g.name,
        nFilmes: Array.isArray(g.films) ? g.films.length : 0
      }));
      res.render('generos', { title: 'Géneros', generos });
    })
    .catch(err => {
      res.status(500).render('error', { message: 'Erro ao obter géneros', error: err });
    });
});

// 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Rota não encontrada', error: { status: 404 } });
});

// start
const PORT = process.env.PORT || 7790;
app.listen(PORT, () => {
  console.log('Interface Cinema em http://localhost:' + PORT);
});

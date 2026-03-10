var express = require('express')
var axios = require('axios')
var router = express.Router()

/* GET / e /filmes - lista de filmes */
router.get(['/', '/filmes'], function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/filmes')
    .then(resp => {
      var filmes = resp.data.map(f => ({
        id: f.id,
        title: f.title,
        year: f.year,
        numGenres: f.genres ? f.genres.length : 0,
        numCast: f.cast ? f.cast.length : 0
      }))
      res.render('filmes', { filmes: filmes, title: 'Lista de Filmes', date: d })
    })
    .catch(err => {
      res.render('error', { message: 'Erro ao obter filmes', error: err })
    })
})

/* GET /filmes/:id - detalhe de um filme */
router.get('/filmes/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/filmes/' + req.params.id)
    .then(resp => {
      res.render('filme', { filme: resp.data, title: resp.data.title, date: d })
    })
    .catch(err => {
      res.render('error', { message: 'Filme não encontrado', error: err })
    })
})

/* GET /atores - lista de atores */
router.get('/atores', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/atores')
    .then(resp => {
      var atores = resp.data.map(a => ({
        id: a.id,
        name: a.name,
        numFilms: a.films ? a.films.length : 0
      }))
      res.render('atores', { atores: atores, title: 'Lista de Atores', date: d })
    })
    .catch(err => {
      res.render('error', { message: 'Erro ao obter atores', error: err })
    })
})

/* GET /atores/:id - página do ator */
router.get('/atores/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/atores/' + req.params.id)
    .then(resp => {
      res.render('ator', { ator: resp.data, title: resp.data.name, date: d })
    })
    .catch(err => {
      res.render('error', { message: 'Ator não encontrado', error: err })
    })
})

/* GET /generos - lista de géneros */
router.get('/generos', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/generos')
    .then(resp => {
      var generos = resp.data.map(g => ({
        id: g.id,
        name: g.name,
        numFilms: g.films ? g.films.length : 0
      }))
      res.render('generos', { generos: generos, title: 'Lista de Géneros', date: d })
    })
    .catch(err => {
      res.render('error', { message: 'Erro ao obter géneros', error: err })
    })
})

/* GET /generos/:id - página do género */
router.get('/generos/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/generos/' + req.params.id)
    .then(resp => {
      res.render('genero', { genero: resp.data, title: resp.data.name, date: d })
    })
    .catch(err => {
      res.render('error', { message: 'Género não encontrado', error: err })
    })
})

module.exports = router

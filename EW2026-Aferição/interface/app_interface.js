const express = require('express')
const axios   = require('axios')
const path    = require('path')

const app     = express()
const API_URL = process.env.API_URL || 'http://localhost:16025'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

// Logger 
app.use((req, res, next) => {
  const d = new Date().toISOString().substring(0, 16)
  console.log(`${req.method} ${req.url} ${d}`)
  next()
})

// GET / 
app.get('/', (req, res) => res.redirect('/repairs'))

// GET /repairs
app.get('/repairs', (req, res) => {
  axios.get(`${API_URL}/repairs`)
    .then(({ data }) => res.render('index', { title: 'Reparações', repairs: data }))
    .catch(err => res.status(500).render('error', { message: 'Erro ao obter reparações', error: err }))
})

// GET /repairs/:id
app.get('/repairs/:id', (req, res) => {
  axios.get(`${API_URL}/repairs/${req.params.id}`)
    .then(({ data }) => res.render('repair', { title: 'Detalhe', repair: data }))
    .catch(err => {
      const code = err.response ? err.response.status : 500
      res.status(code).render('error', { message: 'Registo não encontrado', error: err })
    })
})

//  GET /:marca
app.get('/marca/:marca', (req, res) => {
  const marca = req.params.marca
  axios.get(`${API_URL}/repairs?marca=${encodeURIComponent(marca)}`)
    .then(({ data }) => {
      if (!data.length) return res.status(404).render('error', { message: `Marca "${marca}" não encontrada`, error: { status: 404 } })
      const modelos = [...new Set(data.map(r => r.viatura.modelo))].sort()
      res.render('marca', { title: marca, marca, modelos, repairs: data })
    })
    .catch(err => res.status(500).render('error', { message: 'Erro ao obter marca', error: err }))
})

app.use((req, res) => {
  res.status(404).render('error', { message: 'Página não encontrada', error: { status: 404 } })
})

const PORT = process.env.PORT || 16026
app.listen(PORT, () => console.log(`Interface a correr em http://localhost:${PORT}`))
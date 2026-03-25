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
app.get('/', (req, res) => {
  axios.get(`${API_URL}/repairs`)
    .then(({ data }) => res.render('index', { title: 'Reparações', repairs: data }))
    .catch(err => res.status(500).render('error', { message: 'Erro ao obter reparações', error: err }))
})

// GET /:param — id começa com dígito, marca começa com letra maiúscula
app.get('/:param', (req, res) => {
  const param = req.params.param
  const isId = /^\d/.test(param)

  if (isId) {
    axios.get(`${API_URL}/repairs/${param}`)
      .then(({ data }) => res.render('repair', { title: 'Detalhe', repair: data }))
      .catch(err => {
        const code = err.response ? err.response.status : 500
        res.status(code).render('error', { message: 'Registo não encontrado', error: err })
      })
  } else {
    axios.get(`${API_URL}/repairs?marca=${encodeURIComponent(param)}`)
      .then(({ data }) => {
        if (!data.length) return res.status(404).render('error', { message: `Marca "${param}" não encontrada`, error: { status: 404 } })
        const modelos = [...new Set(data.map(r => r.viatura.modelo))].sort()
        res.render('marca', { title: param, marca: param, modelos, repairs: data })
      })
      .catch(err => res.status(500).render('error', { message: 'Erro ao obter marca', error: err }))
  }
})

app.use((req, res) => {
  res.status(404).render('error', { message: 'Página não encontrada', error: { status: 404 } })
})

const PORT = process.env.PORT || 16026
app.listen(PORT, () => console.log(`Interface a correr em http://localhost:${PORT}`))
const express  = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

// Logger
app.use((req, res, next) => {
  const d = new Date().toISOString().substring(0, 16)
  console.log(`${req.method} ${req.url} ${d}`)
  next()
})

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/autoRepair'

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB ligado a autoRepair')
  } catch (err) {
    console.error('Erro MongoDB:', err.message)
    setTimeout(connectMongo, 5000)
  }
}
connectMongo()

// recusa pedidos se a BD não estiver pronta 
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ erro: 'Base de dados indisponível. Tente em instantes.' })
  }
  next()
})

// Schema / Model
const intervencaoSchema = new mongoose.Schema({
  codigo:    String,
  nome:      String,
  descricao: String
}, { _id: false })

const repairSchema = new mongoose.Schema({
  nome:            String,
  nif:             Number,
  data:            String,
  viatura: {
    marca:     String,
    modelo:    String,
    matricula: String
  },
  nr_intervencoes: Number,
  intervencoes:    [intervencaoSchema]
})

const Repair = mongoose.model('Repair', repairSchema, 'repairs')

// GET /repairs/matrículas
app.get('/repairs/matrículas', async (req, res) => {
  try {
    const matriculas = await Repair.distinct('viatura.matricula')
    matriculas.sort()
    res.json(matriculas)
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// GET /repairs/interv
app.get('/repairs/interv', async (req, res) => {
  try {
    const result = await Repair.aggregate([
      { $unwind: '$intervencoes' },
      { $group: {
          _id:       '$intervencoes.codigo',
          nome:      { $first: '$intervencoes.nome' },
          descricao: { $first: '$intervencoes.descricao' }
      }},
      { $sort: { _id: 1 } },
      { $project: { _id: 0, codigo: '$_id', nome: 1, descricao: 1 } }
    ])
    res.json(result)
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// GET /repairs | ?ano=YYYY | ?marca=X
app.get('/repairs', async (req, res) => {
  try {
    const { ano, marca } = req.query
    const filtro = {}
    if (ano)   filtro.data             = { $regex: `^${ano}` }
    if (marca) filtro['viatura.marca'] = marca
    res.json(await Repair.find(filtro))
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// GET /repairs/:id
app.get('/repairs/:id', async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id)
    if (!repair) return res.status(404).json({ erro: 'Registo não encontrado' })
    res.json(repair)
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// POST /repairs
app.post('/repairs', async (req, res) => {
  try {
    const novo = await new Repair(req.body).save()
    res.status(201).json(novo)
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// DELETE /repairs/:id
app.delete('/repairs/:id', async (req, res) => {
  try {
    const eliminado = await Repair.findByIdAndDelete(req.params.id)
    if (!eliminado) return res.status(404).json({ erro: 'Registo não encontrado' })
    res.json({ mensagem: 'Eliminado com sucesso', id: req.params.id })
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// Servidor
const PORT = process.env.PORT || 16025
app.listen(PORT, () => console.log(`API a correr em http://localhost:${PORT}/repairs`))
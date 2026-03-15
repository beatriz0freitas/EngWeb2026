const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Logger
app.use(function(req, res, next){
    const d = new Date().toISOString().substring(0, 16);
    console.log(req.method + ' ' + req.url + ' ' + d);
    next();
});

// Conexão ao MongoDB
const nomeBD = 'cinema';
const mongoHost = process.env.MONGO_URL || `mongodb://127.0.0.1:27017/${nomeBD}`;

async function connectMongo() {
    try {
        await mongoose.connect(mongoHost);
        console.log(`MongoDB: liguei-me à base de dados '${nomeBD}'.`);
    } catch (err) {
        console.error('Erro MongoDB (nova tentativa em 5s):', err.message);
        setTimeout(connectMongo, 5000);
    }
}

connectMongo();

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB: ligação perdida.');
});

// Esquemas flexíveis 
const opts = { strict: false, versionKey: false };
const Filme  = mongoose.model('Filme',  new mongoose.Schema({}, { ...opts, collection: 'filmes'  }));
const Ator   = mongoose.model('Ator',   new mongoose.Schema({}, { ...opts, collection: 'atores'  }));
const Genero = mongoose.model('Genero', new mongoose.Schema({}, { ...opts, collection: 'generos' }));

// Guard de disponibilidade da BD
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Base de dados indisponível. Tente novamente em instantes.' });
    }
    next();
});

// GET /filmes
app.get('/filmes', async (req, res) => {
    try {
        let queryObj = { ...req.query };
        const fields = queryObj._select;
        const sortField = queryObj._sort;
        const order = queryObj._order === 'desc' ? -1 : 1;

        delete queryObj._select;
        delete queryObj._sort;
        delete queryObj._order;

        // pesquisa simples por q no título
        if (queryObj.q) {
            queryObj.title = { $regex: queryObj.q, $options: 'i' };
            delete queryObj.q;
        }

        if (queryObj.id) {
            queryObj.id = Number(queryObj.id);
        }
        if (queryObj.year) {
            queryObj.year = Number(queryObj.year);
        }

        let projection = {};
        if (fields) {
            fields.split(',').forEach(f => {
                projection[f.trim()] = 1;
            });
        }

        let execQuery = Filme.find(queryObj, projection);
        if (sortField) {
            execQuery = execQuery.sort({ [sortField]: order });
        }

        const filmes = await execQuery.exec();
        res.json(filmes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /filmes/:id
app.get('/filmes/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const filme = await Filme.findOne({ id: id });

        if (!filme) {
            return res.status(404).json({ error: 'Filme não encontrado' });
        }

        res.json(filme);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /atores
app.get('/atores', async (req, res) => {
    try {
        let queryObj = { ...req.query };
        const fields = queryObj._select;
        const sortField = queryObj._sort;
        const order = queryObj._order === 'desc' ? -1 : 1;

        delete queryObj._select;
        delete queryObj._sort;
        delete queryObj._order;

        if (queryObj.q) {
            queryObj.name = { $regex: queryObj.q, $options: 'i' };
            delete queryObj.q;
        }

        if (queryObj.id) {
            queryObj.id = Number(queryObj.id);
        }

        let projection = {};
        if (fields) {
            fields.split(',').forEach(f => {
                projection[f.trim()] = 1;
            });
        }

        let execQuery = Ator.find(queryObj, projection);
        if (sortField) {
            execQuery = execQuery.sort({ [sortField]: order });
        }

        const atores = await execQuery.exec();
        res.json(atores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /atores/:id
app.get('/atores/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const ator = await Ator.findOne({ id: id });

        if (!ator) {
            return res.status(404).json({ error: 'Ator não encontrado' });
        }

        res.json(ator);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /generos
app.get('/generos', async (req, res) => {
    try {
        let queryObj = { ...req.query };
        const fields = queryObj._select;
        const sortField = queryObj._sort;
        const order = queryObj._order === 'desc' ? -1 : 1;

        delete queryObj._select;
        delete queryObj._sort;
        delete queryObj._order;

        if (queryObj.q) {
            queryObj.name = { $regex: queryObj.q, $options: 'i' };
            delete queryObj.q;
        }

        if (queryObj.id) {
            queryObj.id = Number(queryObj.id);
        }

        let projection = {};
        if (fields) {
            fields.split(',').forEach(f => {
                projection[f.trim()] = 1;
            });
        }

        let execQuery = Genero.find(queryObj, projection);
        if (sortField) {
            execQuery = execQuery.sort({ [sortField]: order });
        }

        const generos = await execQuery.exec();
        res.json(generos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /generos/:id
app.get('/generos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const genero = await Genero.findOne({ id: id });

        if (!genero) {
            return res.status(404).json({ error: 'Género não encontrado' });
        }

        res.json(genero);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Arranque
const PORT = process.env.PORT || 7789;
app.listen(PORT, () => console.log(`API Cinema a escutar na porta ${PORT}`));


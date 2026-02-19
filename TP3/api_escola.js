/* --- api_escola.js: servidor de uma API de dados a usar o json-server para suportar o modelo de dados
   ---
   --- Rotas implementadas:
        GET /alunos       : [id, nome, dataNasc, curso, anoCurso, instrumento]
        GET /cursos       : [id, designacao, duracao, instrumento]
        GET /instrumentos : [id, #text]
   --------------------------------------------------------------------- */

const axios = require('axios')
const http = require('http')

// ─── Servidor ─────────────────────────────────────────────────────────────────

http.createServer(async function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if (req.method === "GET") {

        // ── GET /alunos ───────────────────────────────────────────────────────
        if (req.url == "/alunos") {
            try {
                const resp = await axios.get("http://localhost:3000/alunos")
                const resultado = resp.data.map(a => ({
                    id:          a.id,
                    nome:        a.nome,
                    dataNasc:    a.dataNasc,
                    curso:       a.curso,
                    anoCurso:    a.anoCurso,
                    instrumento: a.instrumento
                }))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(resultado))

            } catch (error) {
                res.writeHead(502, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                    erro: "Erro ao contactar o servidor de dados",
                    detalhe: error.message
                }))
            }

        // ── GET /cursos ───────────────────────────────────────────────────────
        } else if (req.url == "/cursos") {
            try {
                const resp = await axios.get("http://localhost:3000/cursos")
                const resultado = resp.data.map(c => ({
                    id:          c.id,
                    designacao:  c.designacao,
                    duracao:     c.duracao,
                    instrumento: c.instrumento["#text"]
                }))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(resultado))

            } catch (error) {
                res.writeHead(502, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                    erro: "Erro ao contactar o servidor de dados",
                    detalhe: error.message
                }))
            }

        // ── GET /instrumentos ─────────────────────────────────────────────────
        } else if (req.url == "/instrumentos") {
            try {
                const resp = await axios.get("http://localhost:3000/instrumentos")
                const resultado = resp.data.map(i => ({
                    id:   i.id,
                    nome: i["#text"]
                }))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(resultado))

            } catch (error) {
                res.writeHead(502, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                    erro: "Erro ao contactar o servidor de dados",
                    detalhe: error.message
                }))
            }

        // ── Rota não suportada ────────────────────────────────────────────────
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
                erro: "Rota não suportada",
                metodo: req.method,
                caminho: req.url
            }))
        }

    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
            erro: "Método não permitido",
            metodo: req.method
        }))
    }

}).listen(3001)

console.log("API da Escola de Música à escuta na porta 3001...")
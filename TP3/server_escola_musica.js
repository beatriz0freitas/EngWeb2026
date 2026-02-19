const axios = require('axios')
const http = require('http')
const { pagina, link, card, tabelaHTML } = require('./htmlUtils.js')

async function getAlunos() {
    const resp = await axios.get("http://localhost:3000/alunos")
    return resp.data
}

async function getCursos() {
    const resp = await axios.get("http://localhost:3000/cursos")
    return resp.data
}

async function getInstrumentos() {
    const resp = await axios.get("http://localhost:3000/instrumentos")
    return resp.data
}

http.createServer(async function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    switch (req.method) {
        case "GET":

            // ── PÁGINA INICIAL ────────────────────────────────────────────────
            if (req.url == "/") {
                try {
                    var corpo = card("Escola de Música — Serviços disponíveis", `
                        <ul class="w3-ul w3-hoverable">
                            <li>${link("/alunos", "Lista de Alunos")}</li>
                            <li>${link("/cursos", "Lista de Cursos")}</li>
                            <li>${link("/instrumentos", "Lista de Instrumentos")}</li>
                        </ul>
                    `)

                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(pagina("Escola de Música", corpo))

                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(`<p>Erro ao carregar página inicial.</p>`)
                }

            // ── LISTA DE ALUNOS ───────────────────────────────────────────────
            } else if (req.url == "/alunos") {
                try {
                    var alunos = await getAlunos()
                    var linhas = alunos.map(a =>
                        `<tr>
                            <td>${a.id}</td>
                            <td>${a.nome}</td>
                            <td>${a.dataNasc}</td>
                            <td>${link("/cursos", a.curso)}</td>
                            <td>${a.anoCurso}</td>
                            <td>${link("/instrumentos", a.instrumento)}</td>
                        </tr>`).join("")

                    var corpo = `
                        ${card("Lista de Alunos", tabelaHTML(["ID", "Nome", "Data de Nasc.", "Curso", "Ano", "Instrumento"], linhas))}
                    `
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(pagina("Alunos", corpo))

                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(`<p>Erro ao carregar alunos.</p>`)
                }

            // ── LISTA DE CURSOS ───────────────────────────────────────────────
            } else if (req.url == "/cursos") {
                try {
                    var cursos = await getCursos()
                    var linhas = cursos.map(c =>
                        `<tr>
                            <td>${c.id}</td>
                            <td>${c.designacao}</td>
                            <td>${c.duracao} anos</td>
                            <td>${link("/instrumentos", c.instrumento["#text"])}</td>
                        </tr>`).join("")

                    var corpo = `
                        ${card("Lista de Cursos", tabelaHTML(["ID", "Designação", "Duração", "Instrumento"], linhas))}
                    `
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(pagina("Cursos", corpo))

                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(`<p>Erro ao carregar cursos.</p>`)
                }

            // ── LISTA DE INSTRUMENTOS ─────────────────────────────────────────
            } else if (req.url == "/instrumentos") {
                try {
                    var instrumentos = await getInstrumentos()
                    var linhas = instrumentos.map(i =>
                        `<tr>
                            <td>${i.id}</td>
                            <td>${i["#text"]}</td>
                        </tr>`).join("")

                    var corpo = `
                        ${card("Lista de Instrumentos", tabelaHTML(["ID", "Instrumento"], linhas))}
                    `
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(pagina("Instrumentos", corpo))

                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(`<p>Erro ao carregar instrumentos.</p>`)
                }

            // ── Rota não suportada ────────────────────────────────────────────
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(`<p>Rota não suportada: ${req.url}.</p>`)
            }
            break

        default:
            res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(`<p>Método não suportado: ${req.method}.</p>`)
    }

}).listen(7777)

console.log('Servidor à escuta na porta 7777')
console.log('Rotas disponíveis:')
console.log('  http://localhost:7777/alunos')
console.log('  http://localhost:7777/cursos')
console.log('  http://localhost:7777/instrumentos')
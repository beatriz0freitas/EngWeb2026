var http = require('http')
var axios = require('axios')
var url = require('url')
var qs = require('qs')

var templates = require('./template.js')
var staticMod = require('./static.js')
var calcularStats = require('./stats.js')

function collectRequestBodyData(request, callback) {
    if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', chunk => { body += chunk.toString() })
        request.on('end', () => { callback(qs.parse(body)) })
    } else {
        callback(null)
    }
}

var emdServer = http.createServer((req, res) => {

    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + ' ' + req.url + ' ' + d)

    // Parse da URL para separar pathname e query parameters
    var parsedUrl = url.parse(req.url, true)
    var pathname = parsedUrl.pathname
    var query = parsedUrl.query

    // verifica se é um recurso estático (CSS, imagens)
    if (staticMod.staticResource(req)) {
        staticMod.serveStaticResource(req, res)
        return
    }

    switch (req.method) {
        case 'GET':

            // GET / ou GET /emd - Lista todos os EMD
            if (pathname === '/' || pathname === '/emd') {
                var sort = query._sort || 'dataEMD'
                var order = query._order ? '&_order=' + query._order : ''
                axios.get('http://localhost:3000/emd?_sort=' + sort + order)
                    .then(resp => {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.end(templates.emdListPage(resp.data, d))
                    })
                    .catch(erro => {
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.end("<p>Erro ao obter lista: " + erro + "</p>")
                    })
            }

            // GET /emd/stats - Estatísticas
            else if (pathname === '/emd/stats') {
                axios.get('http://localhost:3000/emd')
                    .then(resp => {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.end(templates.emdStatsPage(calcularStats(resp.data), d))
                    })
                    .catch(erro => {
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.write("<p>Erro ao calcular stats: " + erro + "</p>")
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
            }

            // GET /emd/registo ─ Formulário para criar um novo EMD (campos vazios)
            else if (pathname === '/emd/registo') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(templates.emdFormPage(d))
            }

            // GET /emd/editar/:id ─ Formulário para editar um EMD existente 
            else if (/\/emd\/editar\/[0-9a-zA-Z_]+$/.test(pathname)) {
                var idEMD = pathname.split('/')[3]
                axios.get('http://localhost:3000/emd/' + idEMD)
                    .then(resp => {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.end(templates.emdFormEditPage(resp.data, d))
                    })
                    .catch(erro => {
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.write("<p>Erro ao obter EMD: " + erro + "</p>")
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
            }

            // GET /emd/apagar/:id ─ Apaga o registo e redireciona para a lista
            else if (/\/emd\/apagar\/[0-9a-zA-Z_]+$/.test(pathname)) {
                var idEMD = pathname.split('/')[3]
                axios.delete('http://localhost:3000/emd/' + idEMD)
                    .then(() => {
                        // Redireciona para a lista após apagar
                        res.writeHead(302, { 'Location': '/emd' })
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.write("<p>Erro ao apagar: " + erro + "</p>")
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
            }

            // GET /emd/:id ─ Página de detalhe de um EMD específico
            else if (/\/emd\/[0-9a-zA-Z_]+$/.test(pathname)) {
                var idEMD = pathname.split('/')[2]
                axios.get('http://localhost:3000/emd/' + idEMD)
                    .then(resp => {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.end(templates.emdShowPage(resp.data, d))
                    })
                    .catch(erro => {
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.write("<p>Erro ao obter EMD: " + erro + "</p>")
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
            }

            // GET ? 
            else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                res.write("<p>Página não encontrada: " + req.url + "</p>")
                res.end('<address><a href="/">Voltar</a></address>')            }
            break

        case 'POST':

            // POST /emd - Insere um novo registo na base de dados
            if (pathname === '/emd') {
                collectRequestBodyData(req, result => {
                    if (result) {
                        
                        result.federado = result.federado === 'true'
                        result.resultado = result.resultado === 'true'
                        result.idade = parseInt(result.idade)
                        
                        axios.post('http://localhost:3000/emd', result)
                            .then(() => {
                                // Redireciona para a lista após inserir
                                res.writeHead(302, { 'Location': '/emd' })
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' })
                                res.write('<p>Erro ao inserir: ' + erro + '</p>')
                                res.end('<address><a href="/emd">Voltar</a></address>')
                            })
                    } else {
                        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.end('<p>Dados inválidos no body</p>')
                    }
                })
            }

            // POST /emd/:id - Atualiza um registo existente
            else if (/\/emd\/[0-9a-zA-Z_]+$/.test(pathname)) {
                collectRequestBodyData(req, result => {
                    if (result) {
                        
                        var idEMD = pathname.split('/')[2]
                        result.federado = result.federado === 'true'
                        result.resultado = result.resultado === 'true'
                        result.idade = parseInt(result.idade)

                        axios.put('http://localhost:3000/emd/' + idEMD, result)
                            .then(() => {
                                res.writeHead(302, { 'Location': '/emd' })
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' })
                                res.write('<p>Erro ao atualizar: ' + erro + '</p>')
                                res.end('<address><a href="/emd">Voltar</a></address>')
                            })
                    } else {
                        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.end('<p>Dados inválidos no body</p>')
                    }
                })
            }

            else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end('<p>POST não suportado para: ' + req.url + '</p>')
            }
            break

        default:
            res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<p>Método não suportado: ' + req.method + '</p>')
            break
    }
})

emdServer.listen(7778, () => {
    console.log('Servidor EMD à escuta na porta 7778...')
})
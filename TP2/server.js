const axios = require('axios');
const http = require('http');

http.createServer(function (req, res) {

    if (req.url == "/reparacoes") {
        axios.get("http://localhost:3000/reparacoes")
            .then(resp => {
                let html = `
                    <h1>Reparações</h1>
                    <table border="1">
                        <tr>
                            <th>Nome</th>
                            <th>NIF</th>
                            <th>Data</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Matrícula</th>
                            <th>Nº Intervenções</th>
                            <th>Intervenções</th>
                        </tr>
                `
                resp.data.forEach(r => {
                    html += `
                        <tr>
                            <td>${r.nome}</td>
                            <td>${r.nif}</td>
                            <td>${r.data}</td>
                            <td>${r.viatura.marca}</td>
                            <td>${r.viatura.modelo}</td>
                            <td>${r.viatura.matricula}</td>
                            <td>${r.nr_intervencoes}</td>
                            <td>${r.intervencoes.map(i => i.nome).join('<br>')}</td>
                        </tr>
                    `
                });
                html += `</table>`
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(html)
            })
            .catch(error => {
                res.writeHead(520, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end("<pre>" + JSON.stringify(error) + "</pre>")
            })

    } else if (req.url == "/intervencoes") {
        axios.get("http://localhost:3000/reparacoes")
            .then(resp => {
                // Contar ocorrências de cada intervenção
                let counts = {}
                resp.data.forEach(r => {
                    r.intervencoes.forEach(i => {
                        if (!counts[i.codigo]) counts[i.codigo] = { codigo: i.codigo, nome: i.nome, total: 0 }
                        counts[i.codigo].total++
                    })
                })
                let intervencoes = Object.values(counts).sort((a, b) => b.total - a.total)

                let html = `
                    <h1>Tipos de Intervenção</h1>
                    <table border="1">
                        <tr>
                            <th>Código</th>
                            <th>Intervenção</th>
                            <th>Nº de Vezes</th>
                        </tr>
                `
                intervencoes.forEach(i => {
                    html += `
                        <tr>
                            <td>${i.codigo}</td>
                            <td>${i.nome}</td>
                            <td>${i.total}</td>
                        </tr>
                    `
                })
                html += `</table>`
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(html)
            })
            .catch(error => {
                res.writeHead(520, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end("<pre>" + JSON.stringify(error) + "</pre>")
            })

    } else if (req.url == "/viaturas") {
        axios.get("http://localhost:3000/reparacoes")
            .then(resp => {
                // Contar reparações por marca+modelo
                let counts = {}
                resp.data.forEach(r => {
                    let key = `${r.viatura.marca}|${r.viatura.modelo}`
                    if (!counts[key]) counts[key] = { marca: r.viatura.marca, modelo: r.viatura.modelo, total: 0 }
                    counts[key].total++
                })
                let viaturas = Object.values(counts).sort((a, b) => b.total - a.total)

                let html = `
                    <h1>Viaturas Intervencionadas</h1>
                    <table border="1">
                        <tr>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Nº de Reparações</th>
                        </tr>
                `
                viaturas.forEach(v => {
                    html += `
                        <tr>
                            <td>${v.marca}</td>
                            <td>${v.modelo}</td>
                            <td>${v.total}</td>
                        </tr>
                    `
                })
                html += `</table>`
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(html)
            })
            .catch(error => {
                res.writeHead(520, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end("<pre>" + JSON.stringify(error) + "</pre>")
            })

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end("<p>PEDIDO NÃO SUPORTADO. Tente novamente.</p>")
    }

}).listen(7777)

console.log('Servidor à escuta na porta 7777')
console.log('Rotas disponíveis:')
console.log('  http://localhost:7777/reparacoes')
console.log('  http://localhost:7777/intervencoes')
console.log('  http://localhost:7777/viaturas')
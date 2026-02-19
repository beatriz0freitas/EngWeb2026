function pagina(titulo, corpo){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>${titulo}</title>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
    </head>
    <body class="w3-light-grey">

        <div class="w3-container w3-teal">
            <h1>${titulo}</h1>
        </div>

        <div class="w3-bar w3-dark-grey">
            <a href="/" class="w3-bar-item w3-button">HOME</a>
            <a href="/alunos" class="w3-bar-item w3-button">ALUNOS</a>
            <a href="/cursos" class="w3-bar-item w3-button">CURSOS</a>
            <a href="/instrumentos" class="w3-bar-item w3-button">INSTRUMENTOS</a>
        </div>

        <div class="w3-container w3-margin-top">
            ${corpo}
        </div>

    </body>
    </html>
    `
}

function link(href, texto){
    return `<a href="${href}">${texto}</a>`
}

function card(titulo, conteudo){
    return `
    <div class="w3-card-4 w3-white w3-margin-bottom">
        <header class="w3-container w3-teal">
            <h3>${titulo}</h3>
        </header>
        <div class="w3-container w3-padding">
            ${conteudo}
        </div>
    </div>
    `
}

function tabelaHTML(cabecalhos, linhas) {
    return `
        <table class="w3-table w3-striped w3-bordered w3-hoverable">
            <tr class="w3-light-grey">
                ${cabecalhos.map(c => `<th>${c}</th>`).join("")}
            </tr>
            ${linhas}
        </table>
    `
}

module.exports = { pagina, link, card, tabelaHTML }

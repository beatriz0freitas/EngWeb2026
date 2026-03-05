const pug = require('pug');

// recebe o nome do ficheiro pug e os dados a injetar
function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data)
}

exports.emdListPage = (list, date) => renderPug('index', { list, date })
exports.emdShowPage = (emd, date) => renderPug('emd', { emd, date })
exports.emdFormPage = (date) => renderPug('form', { date })
exports.emdFormEditPage = (emd, date) => renderPug('form', { emd, date })
exports.emdStatsPage = (stats, date) => renderPug('stats', { stats, date })
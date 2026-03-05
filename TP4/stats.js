// Recebe o array de todos os EMDs e devolve um objeto com as distribuições
function calcularStats(emds) {
    var stats = {
        total: emds.length,
        porSexo: {},
        porModalidade: {},
        porClube: {},
        porResultado: { 'Apto': 0, 'Inapto': 0 },
        porFederado: { 'Federado': 0, 'Não federado': 0 }
    }

    emds.forEach(emd => {
        var g = emd['género'] || 'Desconhecido'
        stats.porSexo[g] = (stats.porSexo[g] || 0) + 1

        var m = emd.modalidade || 'Desconhecida'
        stats.porModalidade[m] = (stats.porModalidade[m] || 0) + 1

        var c = emd.clube || 'Desconhecido'
        stats.porClube[c] = (stats.porClube[c] || 0) + 1

        if (emd.resultado) stats.porResultado['Apto']++
        else stats.porResultado['Inapto']++

        if (emd.federado) stats.porFederado['Federado']++
        else stats.porFederado['Não federado']++
    })

    // Ordena por contagem decrescente
    stats.porModalidade = ordenarDesc(stats.porModalidade)
    stats.porClube = ordenarDesc(stats.porClube)

    return stats
}

function ordenarDesc(obj) {
    return Object.fromEntries(
        Object.entries(obj).sort((a, b) => b[1] - a[1])
    )
}

module.exports = calcularStats

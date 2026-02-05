import json
import os, shutil

def open_json(filename):
    with open(filename, encoding='utf-8') as file:
        data = json.load(file)
    return data

def mk_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
    else:
        shutil.rmtree(path)
        os.makedirs(path)

def new_file(filename, content):
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(content)


# ------------------ SCRIPT PRINCIPAL ------------------ #
reparacoes_data = open_json('dataset_reparacoes.json')
reparacoes = reparacoes_data["reparacoes"]

# dicionários auxiliares
intervencoes_dict = {}
marcas_modelos_dict = {}

# Processar dados e criar índices
for i, rep in enumerate(reparacoes):
    # Adicionar id único a cada reparação
    rep['id'] = f"rep_{i+1}"
    
    # Indexar intervenções
    for interv in rep['intervencoes']:
        codigo = interv['codigo']
        if codigo not in intervencoes_dict:
            intervencoes_dict[codigo] = {
                'codigo': codigo,
                'nome': interv['nome'],
                'descricao': interv['descricao'],
                'reparacoes': []
            }
        intervencoes_dict[codigo]['reparacoes'].append(rep['id'])
    
    # Indexar marcas e modelos
    marca = rep['viatura']['marca']
    modelo = rep['viatura']['modelo']
    chave = f"{marca}_{modelo}"
    
    if chave not in marcas_modelos_dict:
        marcas_modelos_dict[chave] = {
            'marca': marca,
            'modelo': modelo,
            'reparacoes': []
        }
    marcas_modelos_dict[chave]['reparacoes'].append(rep['id'])

# ------------------ PÁGINA PRINCIPAL ------------------ #
html = f'''
<html>
    <head>
        <title>Oficina Automóvel - Reparações</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h1>Oficina Automóvel - Sistema de Reparações</h1>
        <h3>Dados Consultáveis:</h3>
        <ul>
            <li><a href="listagem_reparacoes.html">Listagem de Reparações</a> </li>
            <li><a href="listagem_intervencoes.html">Tipos de Intervenção</a> </li>
            <li><a href="listagem_marcas.html">Marcas e Modelos</a> </li>
        </ul>
    </body>
</html>
'''

mk_dir("output")
mk_dir("output/reparacoes")
mk_dir("output/intervencoes")
mk_dir("output/marcas")

new_file("./output/index.html", html)

# ------------------ LISTAGEM DE REPARAÇÕES ------------------ #
reparacoes_ordenadas = sorted(reparacoes, key=lambda r: r['data'], reverse=True)

linhas_tabela = ""
for rep in reparacoes_ordenadas:
    linhas_tabela += f'''
        <tr>
            <td><a href="reparacoes/{rep['id']}.html">{rep['data']}</a></td>
            <td>{rep['nif']}</td>
            <td>{rep['nome']}</td>
            <td>{rep['viatura']['marca']}</td>
            <td>{rep['viatura']['modelo']}</td>
            <td>{rep['nr_intervencoes']}</td>
        </tr>
    '''

html = f'''
<html>
    <head>
        <title>Listagem de Reparações</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h2>Listagem de Reparações</h2>
        <table border="1">
            <tr>
                <th>Data</th>
                <th>NIF</th>
                <th>Nome</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Nº Intervenções</th>
            </tr>
            {linhas_tabela}
        </table>
        <hr/>
        <a href="index.html">Voltar ao índice</a>
    </body>
</html>
'''

new_file("./output/listagem_reparacoes.html", html)

# ------------------ LISTAGEM DE INTERVENÇÕES ------------------ #
intervencoes_ordenadas = sorted(intervencoes_dict.items(), key=lambda x: x[0])

linhas_tabela = ""
for codigo, dados in intervencoes_ordenadas:
    linhas_tabela += f'''
        <tr>
            <td><a href="intervencoes/{codigo}.html">{codigo}</a></td>
            <td>{dados['nome']}</td>
            <td>{dados['descricao']}</td>
        </tr>
    '''

html = f'''
<html>
    <head>
        <title>Tipos de Intervenção</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h2>Tipos de Intervenção</h2>
        <table border="1">
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Descrição</th>
            </tr>
            {linhas_tabela}
        </table>
        <hr/>
        <a href="index.html">Voltar ao índice</a>
    </body>
</html>
'''

new_file("./output/listagem_intervencoes.html", html)

# ------------------ LISTAGEM DE MARCAS E MODELOS ------------------ #
marcas_ordenadas = sorted(marcas_modelos_dict.items(), key=lambda x: (x[1]['marca'], x[1]['modelo']))

linhas_tabela = ""
for chave, dados in marcas_ordenadas:
    num_reparacoes = len(dados['reparacoes'])
    linhas_tabela += f'''
        <tr>
            <td><a href="marcas/{chave}.html">{dados['marca']}</a></td>
            <td>{dados['modelo']}</td>
            <td>{num_reparacoes}</td>
        </tr>
    '''

html = f'''
<html>
    <head>
        <title>Marcas e Modelos</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h2>Marcas e Modelos</h2>
        <table border="1">
            <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Nº Reparações</th>
            </tr>
            {linhas_tabela}
        </table>
        <hr/>
        <a href="index.html">Voltar ao índice</a>
    </body>
</html>
'''

new_file("./output/listagem_marcas.html", html)

# ------------------ PÁGINAS INDIVIDUAIS DE REPARAÇÕES ------------------ #

for rep in reparacoes:
    lista_intervencoes = ""
    for interv in rep['intervencoes']:
        lista_intervencoes += f'''
            <li>
                <a href="../intervencoes/{interv['codigo']}.html">{interv['codigo']}</a> - {interv['nome']}
                <br/><small>{interv['descricao']}</small>
            </li>
        '''
    
    marca_modelo_chave = f"{rep['viatura']['marca']}_{rep['viatura']['modelo']}"
    
    html = f'''
<html>
    <head>
        <title>Reparação {rep['id']}</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h2>Reparação {rep['id']}</h2>
        
        <h3>Dados do Cliente</h3>
        <table border="1">
            <tr>
                <td>Nome</td>
                <td>{rep['nome']}</td>
            </tr>
            <tr>
                <td>NIF</td>
                <td>{rep['nif']}</td>
            </tr>
            <tr>
                <td>Data</td>
                <td>{rep['data']}</td>
            </tr>
        </table>
        
        <h3>Dados da Viatura</h3>
        <table border="1">
            <tr>
                <td>Marca</td>
                <td><a href="../marcas/{marca_modelo_chave}.html">{rep['viatura']['marca']}</a></td>
            </tr>
            <tr>
                <td>Modelo</td>
                <td>{rep['viatura']['modelo']}</td>
            </tr>
            <tr>
                <td>Matrícula</td>
                <td>{rep['viatura']['matricula']}</td>
            </tr>
        </table>
        
        <h3>Intervenções Realizadas ({rep['nr_intervencoes']})</h3>
        <ul>
            {lista_intervencoes}
        </ul>
        
        <hr/>
        <a href="../index.html">Voltar ao índice</a> | 
        <a href="../listagem_reparacoes.html">Ver todas as reparações</a>
    </body>
</html>
'''
    
    new_file(f"./output/reparacoes/{rep['id']}.html", html)

# ------------------ PÁGINAS DE INTERVENÇÕES ------------------ #

for codigo, dados in intervencoes_dict.items():
    # procurar reparações onde esta intervenção foi realizada
    reparacoes_com_intervencao = list(filter(lambda r: r['id'] in dados['reparacoes'], reparacoes))
    
    linhas_tabela = ""
    for rep in reparacoes_com_intervencao:
        linhas_tabela += f'''
            <tr>
                <td><a href="../reparacoes/{rep['id']}.html">{rep['data']}</a></td>
                <td>{rep['nome']}</td>
                <td>{rep['viatura']['marca']} {rep['viatura']['modelo']}</td>
                <td>{rep['viatura']['matricula']}</td>
            </tr>
        '''
    
    html = f'''
<html>
    <head>
        <title>{codigo} - {dados['nome']}</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h2>{codigo} - {dados['nome']}</h2>
        
        <h3>Dados da Intervenção</h3>
        <table border="1">
            <tr>
                <td>Código</td>
                <td>{codigo}</td>
            </tr>
            <tr>
                <td>Nome</td>
                <td>{dados['nome']}</td>
            </tr>
            <tr>
                <td>Descrição</td>
                <td>{dados['descricao']}</td>
            </tr>
        </table>
        
        <h3>Reparações onde foi realizada ({len(reparacoes_com_intervencao)})</h3>
        <table border="1">
            <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Viatura</th>
                <th>Matrícula</th>
            </tr>
            {linhas_tabela}
        </table>
        
        <hr/>
        <a href="../index.html">Voltar ao índice</a> | 
        <a href="../listagem_intervencoes.html">Ver todas as intervenções</a>
    </body>
</html>
'''
    
    new_file(f"./output/intervencoes/{codigo}.html", html)

# ------------------ PÁGINAS DE MARCAS/MODELOS ------------------ #

for chave, dados in marcas_modelos_dict.items():
    # procurar reparações deste marca/modelo
    reparacoes_marca_modelo = list(filter(lambda r: r['id'] in dados['reparacoes'], reparacoes))
    
    linhas_tabela = ""
    for rep in reparacoes_marca_modelo:
        linhas_tabela += f'''
            <tr>
                <td><a href="../reparacoes/{rep['id']}.html">{rep['data']}</a></td>
                <td>{rep['nome']}</td>
                <td>{rep['viatura']['matricula']}</td>
                <td>{rep['nr_intervencoes']}</td>
            </tr>
        '''
    
    html = f'''
<html>
    <head>
        <title>{dados['marca']} {dados['modelo']}</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h2>{dados['marca']} {dados['modelo']}</h2>
        
        <h3>Informação</h3>
        <table border="1">
            <tr>
                <td>Marca</td>
                <td>{dados['marca']}</td>
            </tr>
            <tr>
                <td>Modelo</td>
                <td>{dados['modelo']}</td>
            </tr>
            <tr>
                <td>Nº Reparações</td>
                <td>{len(reparacoes_marca_modelo)}</td>
            </tr>
        </table>
        
        <h3>Histórico de Reparações ({len(reparacoes_marca_modelo)})</h3>
        <table border="1">
            <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Matrícula</th>
                <th>Nº Intervenções</th>
            </tr>
            {linhas_tabela}
        </table>
        
        <hr/>
        <a href="../index.html">Voltar ao índice</a> | 
        <a href="../listagem_marcas.html">Ver todas as marcas</a>
    </body>
</html>
'''
    
    new_file(f"./output/marcas/{chave}.html", html)

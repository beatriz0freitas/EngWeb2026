# TPC5: Cinema

* **Data:** Março 2026
* **Autor:** Ana Freitas
* **Unidade Curricular:** Engenharia Web

---

## Identificação do Autor

- **ID:** a106853
- **Nome:** Ana Beatriz Ribeiro Freitas
- **Curso:** Licenciatura em Engenharia Informática

<p align="center">
  <img src="../.github/images/bf.jpeg" alt="Fotografia do autor" width="300"/>
</p>

---

## Resumo

* Pré-processamento do dataset original `cinema.json` com recurso a `script_db.py` para limpar e normalizar os dados. O dataset original não continha IDs, pelo que foram atribuídos sequencialmente a cada filme. O campo `cast` continha dados ruidosos que foram filtrados através de duas heurísticas: uma função `parece_nome` que valida cada entrada individualmente, e uma validação ao nível do cast que descarta o array inteiro quando menos de metade das entradas parecem nomes.
* A partir dos filmes limpos, foram extraídas listas únicas de atores e géneros, cada um com o seu próprio ID e a lista de filmes em que aparece. A associação entre entidades é feita por objetos `{id, title/name}`, permitindo que cada rota do servidor precise de apenas um pedido ao json-server (sem necessidade de resolver IDs adicionais). O resultado é gravado em `dataset_cinema.json` com 3 coleções: `filmes`, `atores` e `generos`.
* Utilização do json-server para servir o `dataset_cinema.json` como API REST na porta 3000, expondo automaticamente os endpoints `/filmes`, `/atores` e `/generos` com suporte a queries por ID e filtragem.
* Estrutura base do projeto gerada com o Express Application Generator e posteriormente adaptada para o contexto do cinema.
* Desenvolvimento de um servidor aplicacional Express na porta 7777 que consome a API do json-server através da biblioteca `axios`. O `axios` faz pedidos GET ao json-server para obter os dados, que são depois passados aos templates Pug para gerar as páginas HTML devolvidas ao browser.
* Os templates Pug na pasta `views/` utilizam herança de templates: um `layout.pug` base define a estrutura HTML comum com cabeçalho com W3.CSS via CDN, barra de navegação entre Filmes/Atores/Géneros, e footer, e cada página específica como  `filmes.pug`, `ator.pug`, etc. estende esse layout e preenche apenas o bloco de conteúdo.
* Todas as rotas estão centralizadas num único ficheiro `routes/index.js`. As rotas `/` e `/filmes` partilham o mesmo handler, evitando duplicação de código. Cada rota faz apenas um pedido GET ao json-server, uma vez que o dataset já guarda as associações como objetos `{id, title/name}`, dispensando pedidos adicionais para resolver referências.
* Navegação completa com links cruzados entre todas as entidades onde as tabelas de listagem têm linhas clicáveis que levam à página de detalhe. Nas páginas de detalhe, listas vazias apresentam uma mensagem informativa em vez de ficarem em branco.

---

## Resultados - Ficheiros Desenvolvidos

#### Manipulação de Dados

- **script_db.py**
  Script Python que lê `cinema.json`, atribui IDs sequenciais a cada filme, limpa o campo `cast` (filtrando entradas inválidas como fragmentos de descrições e pontuação), e extrai listas únicas de atores e géneros através de uma função genérica `extrair_entidades`, cada um com o seu ID e a lista de filmes `{id, title}` associados. Os filmes guardam por sua vez os seus atores e géneros como `{id, name}`. Os atores e géneros são ordenados alfabeticamente.
- **dataset_cinema.json**
  Ficheiro gerado pelo script com 3 coleções (`filmes`, `atores`, `generos`), pronto a ser servido pelo json-server.

#### Servidor Aplicacional (Express)

- **app.js**
  Ficheiro principal do Express. Configura o Pug como motor de templates, regista middleware de logging e parsing, serve ficheiros estáticos da pasta `public/` e delega todas as rotas para `routes/index.js`.
- **bin/www**
  Ponto de entrada HTTP na porta 7777.
- **routes/index.js**
  Ficheiro único que centraliza todas as rotas. Usa `axios` para consultar a API REST do json-server.

  ###### Serviços disponibilizados - porta 7777


  - `GET /` e `GET /filmes`
    Tabela com todos os filmes com informação como id, título, ano, #géneros, #cast e com contagem total no título. Linhas clicáveis.
  - `GET /filmes/:id`
    Detalhe de um filme com toda a sua informação como título, ano, géneros, cast.
  - `GET /atores`
    Tabela com todos os atores com informação como id, nome, #filmes. Linhas clicáveis.
  - `GET /atores/:id`
    Página do ator com lista dos seus filmes como links clicáveis.
  - `GET /generos`
    Tabela com todos os géneros com informação como id, nome, #filmes. Linhas clicáveis.
  - `GET /generos/:id`
    Página do género com lista dos seus filmes como links clicáveis.

#### Views (Pug)

- **views/layout.pug**
  Layout base com W3.CSS, navbar (Filmes, Atores, Géneros) com destaque da secção ativa, e footer.
- **views/filmes.pug**
  Tabela de filmes com contagem total no título e linhas clicáveis.
- **views/filme.pug**
  Detalhe de um filme com ID, ano, géneros (links para `/generos/:id`) e cast (links para `/atores/:id`).
- **views/atores.pug**
  Tabela de atores com contagem total no título e linhas clicáveis.
- **views/ator.pug**
  Página de um ator com filmes associados como links.
- **views/generos.pug**
  Tabela de géneros com contagem total no título e linhas clicáveis.
- **views/genero.pug**
  Página de um género com filmes associados como links.
- **views/error.pug**
  Página de erro com mensagem e stack trace.

#### Recursos Estáticos

- **public/stylesheets/style.css**
  Estilos base, gerado pelo Express Generator.

#### Documentação

- **README.md**
  Documento que descreve a estrutura da aplicação, os objetivos do trabalho e o modo de execução do sistema.

---

## Instruções de Execução

Instalar as dependências necessárias para o gerador:

```
npm i express --save
npm install pug
```

Gerar a estrutura Express com Pug como motor de templates (apenas na primeira vez):

```
npx express-generator --view=pug
```

Instalar todas as dependências do projeto (inclui `axios`, adicionado manualmente ao `package.json`):

```
npm install
```

Gerar o dataset processado a partir do `cinema.json` original:

```
python3 script_db.py
```

Terminal A - iniciar o servidor de dados (json-server na porta 3000):

```
npm run db
```

Terminal B - iniciar o servidor aplicacional (Express na porta 7777):

```
npm run start
```

Aceder no browser a [http://localhost:7777](http://localhost:7777)

---

**Universidade do Minho - Escola de Engenharia**

# TPC6: Cinema

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

* O objetivo deste TPC foi criar uma aplicação web completa sobre cinema americano, dividida em três camadas: **dados**, **API** e **interface**.
* O ponto de partida foi o ficheiro `cinema.json`, que tinha vários problemas práticos para uso direto (falta de IDs, cast com ruído e informação pouco uniforme).
* Para resolver isso, foi criado o `script_db.py`, que faz o pipeline de preparação: lê o dataset original, limpa entradas inválidas, gera identificadores e normaliza relações.
* Durante a limpeza, o campo `cast` foi tratado com heurísticas para manter apenas nomes válidos, reduzindo dados “lixo” que prejudicam pesquisa e navegação.
* Após o processamento, os dados foram organizados em três coleções (`filmes`, `atores`, `generos`), com referências cruzadas entre entidades para facilitar páginas de detalhe e links internos.
* O resultado final da transformação fica em `api_dados/db/filmes.json`, `api_dados/db/atores.json` e `api_dados/db/generos.json`.
* A carga da base de dados foi automatizada com MongoDB + `mongoimport`, para que o ambiente fique pronto logo no arranque dos containers, sem passos manuais de importação.
* A API foi desenvolvida com Express + Mongoose (porta **7789**) e centraliza a lógica de acesso aos dados.
* Além de endpoints de listagem e detalhe, a API suporta pesquisa textual e ordenação (`q`, `_select`, `_sort`, `_order`), permitindo consultas mais flexíveis.
* A interface foi desenvolvida com Express + Pug (porta **7790**), consumindo a API com `axios` e transformando os dados em páginas HTML de listagem e detalhe.
* A organização da interface privilegia navegação simples: tabelas para listas e páginas específicas para cada filme/ator/género.
* Em termos de execução, toda a solução foi dockerizada com `docker-compose`, com três serviços integrados (`mongodb`, `api`, `interface`) a comunicar numa rede interna.
* Desta forma qualquer máquina com Docker consegue levantar o sistema completo com o mesmo comportamento.

---

## Resultados - Ficheiros Desenvolvidos

## Notas

- A API e o MongoDB comunicam por rede interna no `docker-compose`.
- Se a API arrancar antes do MongoDB, a ligação é tentada novamente automaticamente.

#### Manipulação de Dados

- **api_dados/script_db.py**
  Script python responsável por preparar os dados para a aplicação. Este remove ruído e valores pouco úteis no `cast`, cria IDs sequenciais e constrói relações entre entidades. Exporta ainda três coleções independentes para import no MongoDB.
- **api_dados/db/filmes.json**, **api_dados/db/atores.json**, **api_dados/db/generos.json**
  Ficheiros finais gerados pelo script. Estes ficheiros já estão no formato esperado pelo `mongoimport` e são usados diretamente pelo container do MongoDB.

#### Servidor Aplicacional (Express)

- **api_dados/cinemaServer.js**
  API de dados (Express + Mongoose) ligada ao MongoDB. Esta camada concentra toda a lógica de acesso aos dados e responde em JSON.

  ###### Serviços disponibilizados - porta 7789


  - `GET /filmes`
  - `GET /filmes/:id`
  - `GET /atores`
  - `GET /atores/:id`
  - `GET /generos`
  - `GET /generos/:id`

  Os endpoints de listagem suportam `q` para pesquisa textual,  `_select` para escolher campos devolvidos e `_sort` e `_order` para ordenação.
- **interface/app_interface.js**
  Servidor da interface (Express + Pug). Esta camada recebe pedidos do browser, consulta a API com `axios`, transforma/organiza os dados para visualização e renderiza os templates Pug.

  ###### Serviços disponibilizados - porta 7790


  - `GET /filmes`
    Tabela com todos os filmes (id, título, ano, nº atores, nº géneros), com links para detalhe.
  - `GET /filmes/:id`
    Página de detalhe de um filme.
  - `GET /atores`
    Tabela com todos os atores (id, nome, nº filmes), com links para detalhe.
  - `GET /atores/:id`
    Página de detalhe de um ator com lista de filmes.
  - `GET /generos`
    Tabela com todos os géneros (id, nome, nº filmes).
- **api_dados/Dockerfile**
  Define a imagem da API.
- **api_dados/Dockerfile.mongo**
  Define a imagem do MongoDB com import automático dos dados.
- **interface/Dockerfile.interface**
  Define a imagem da interface.
- **docker-compose.yml**
  Orquestra os três serviços (`mongodb`, `api`, `interface`) na mesma rede.

#### Views (Pug)

- **views/layout.pug**
  Layout base comum a todas as páginas (head, menu de navegação, conteúdo e estilos).
- **views/filmes.pug**
  Página de listagem de filmes em tabela, com links para o detalhe.
- **views/filme.pug**
  Página de detalhe de um filme (dados principais, cast e géneros).
- **views/atores.pug**
  Página de listagem de atores em tabela.
- **views/ator.pug**
  Página de detalhe de ator com lista de filmes associados.
- **views/generos.pug**
  Página de listagem de géneros.
- **views/error.pug**
  Página de erro usada quando há falhas na API ou rotas inválidas.

#### Recursos Estáticos

- **public/stylesheets/style.css**
  Ficheiro de estilos (baseado em W3.CSS) usado por todas as páginas da interface para manter consistência visual.

#### Documentação

- **README.md**
  Documento com descrição da aplicação, estrutura de ficheiros e passos para execução.

---

## Instruções de Execução

1) Gerar os ficheiros processados a partir do dataset original:

```bash
cd api_dados
python3 script_db.py
```

2) Na raiz de `TP6/`, arrancar toda a aplicação com Docker Compose:

```bash
docker compose up -d --build
```

3) Aceder no browser a [http://localhost:7790/filmes](http://localhost:7790/filmes)
4) Ver logs dos containers:

```bash
docker logs mongodb_cinema
docker logs interface_cinema
docker logs api_cinema
```

5) Parar os serviços:

```bash
docker compose down
```

6) Parar e apagar também os volumes (dados do MongoDB):

```bash
docker compose down -v
```

---

**Universidade do Minho - Escola de Engenharia**

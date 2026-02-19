# TPC3: A Escola de Música - Servidor Aplicacional para Exploração de dados

* **Data:** Fevereiro 2026
* **Autor:** Ana Freitas
* **Unidade Curricular:** Engenharia Web

---

## Identificação do Autor

- **ID:** a106853
- **Nome:** Ana Beatriz Ribeiro Freitas
- **Curso:** Licenciatura em Engenharia Informática

<p align="center">
  <img src="../bf.jpeg" alt="Fotografia do autor" width="300"/>
</p>

---

## Resumo

* Criação de um json-server para disponibilizar o dataset da Escola de Música `db.json` através de uma API REST, garantindo a separação entre a camada de dados e a camada aplicacional.
* Desenvolvimento de um servidor aplicacional em Node.js `server_escola_musica.js` responsável por consumir os dados do json-server através de `axios` e gerar respostas em HTML dinâmico a partir dos dados recebidos da API.
* Implementação de uma estrutura modular, recorrendo ao módulo auxiliar `htmlUtils.js`, promovendo reutilização de código, organização e separação da lógica de apresentação.
* Implementação de uma página inicial `/` com barra de navegação comum a todas as páginas, permitindo uma navegação intuitiva entre as diferentes secções da aplicação.
* Implementação dos serviços `/alunos`, `/cursos` e `/instrumentos`.

---

## Resultados - Ficheiros Desenvolvidos

#### Servidor Aplicacional

- **server_escola_musica.js**
  Servidor HTTP desenvolvido em Node.js que consome a API do `json-server` via `axios` e responde com tabelas HTML geradas dinamicamente. Inclui uma barra de navegação presente em todas as páginas para facilitar a navegação entre secções.

  ###### Serviços disponibilizados


  - `/`
    Página inicial com links de navegação para as três secções disponíveis.
  - `/alunos`
    Tabela HTML com os dados completos de todos os alunos - ID, nome, data de nascimento, curso, ano e instrumento.
  - `/cursos`
    Tabela HTML com a informação relativa a todos os cursos - ID, designação, duração e instrumento associado.
  - `/instrumentos`
    Tabela HTML com os dados dos vários instrumentos existentes - Id e nome.

#### Módulo auxiliar

- **htmlUtils.js**
  Módulo auxiliar responsável por gerar estruturas HTML reutilizáveis como pagina, link, tabelaHTML, etc. separando a lógica de apresentação do servidor.

#### Documentação

- **README.md**
  Documento que descreve a estrutura da aplicação, os objetivos do trabalho e o modo de execução do sistema.

---

## Instruções de Execução

Instalar dependências

```
  npm install axios
  npm install -g json-server
```

Terminal A — iniciar o servidor de dados

```
json-server --watch db.json 
```

Terminal B — iniciar o servidor aplicacional

```
node server_escola_musica.js
```

Aceder no browser a [http://localhost:7777](http://localhost:7777)

---

**Universidade do Minho - Escola de Engenharia**

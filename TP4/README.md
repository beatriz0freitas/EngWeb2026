# TPC4: Exames Médicos Desportivos

* **Data:** Fevereiro 2026
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

* Utilização do json-server para servir o dataset `emd.json` como API REST na porta 3000.
* Desenvolvimento de um servidor aplicacional `emd_server.js` em Node.js que consome essa API e gera páginas HTML com o motor de templates Pug.
* O servidor recorre a `template.js` para gerar as páginas HTML a partir dos ficheiros Pug, a `static.js` para servir os ficheiros CSS e imagens, e a `stats.js` para calcular as distribuições estatísticas dos registos.
* Utilização da biblioteca `qs` para parse automático de campos aninhados nos formulários (e.g. `nome[primeiro]`).
* CRUD completo sobre os registos EMD: listar, ver detalhe, criar, editar e apagar.
* Página de estatísticas com distribuições por género, modalidade, clube, resultado e federado.
* Botões de ordenação na página principal: por data (decrescente) e por nome (crescente).

---

## Resultados - Ficheiros Desenvolvidos

#### Servidor Aplicacional

- **emd_server.js**
  Servidor HTTP em Node.js que consome o json-server via axios e devolve páginas HTML geradas com Pug.

  ###### Serviços disponibilizados - porta 7778


  - `GET /` ou `GET /emd`
    Tabela com todos os EMD (nome, data, modalidade, resultado). Suporta ordenação por `_sort` e `_order`.
  - `GET /emd/:id`
    Detalhe de um EMD com toda a sua informação.
  - `GET /emd/registo`
    Formulário para criar um novo EMD.
  - `GET /emd/editar/:id`
    Formulário para editar um EMD existente.
  - `GET /emd/apagar/:id`
    Apaga o registo e redireciona para a lista.
  - `GET /emd/stats`
    Distribuições por: género, modalidade, clube, resultado e federado.
  - `POST /emd`
    Insere um novo registo e redireciona para a lista.
  - `POST /emd/:id`
    Atualiza o registo e redireciona para a lista.

#### Módulos Auxiliares

- **template.js**
  Renderiza os ficheiros Pug com os dados recebidos.
- **static.js**
  Serve recursos estáticos (CSS, imagens) da pasta `public/`.
- **stats.js**
  Calcula as distribuições estatísticas dos registos EMD.

#### Views (Pug)

- **views/layout.pug**
  Layout base com W3.CSS e footer comum.
- **views/index.pug**
  Tabela de EMD com botões de ordenação (Data ↓, Nome ↑).
- **views/emd.pug**
  Detalhe de um EMD com botões Voltar, Editar e Apagar.
- **views/form.pug**
  Formulário partilhado para criação e edição.
- **views/stats.pug**
  Estatísticas por género, resultado, federado, modalidade e clube.

#### Recursos Estáticos

- **public/**
  `w3.css` e `favicon.png`.

#### Manipulação de Dados

- **script_db.py**
  Script Python que lê `emd.json`, renomeia o campo `_id` para `id` em cada registo, e grava o resultado em `dataset_emd.json` com a estrutura `{ "emd": [...] }` esperada pelo json-server.
- **dataset_emd.json**
  Ficheiro gerado pelo script, pronto a ser servido pelo json-server.

#### Documentação

- **README.md**
  Documento que descreve a estrutura da aplicação, os objetivos do trabalho e o modo de execução do sistema.

---

## Instruções de Execução

Instalar dependências

```
npm install
npm install qs
```

Terminal A - iniciar o servidor de dados

```
json-server --watch dataset_emd.json
```

Terminal B - iniciar o servidor aplicacional

```
node emd_server.js
```

Aceder no browser a [http://localhost:7778](http://localhost:7778)

---

**Universidade do Minho - Escola de Engenharia**

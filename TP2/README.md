# TPC2: A Oficina – Servidor Aplicacional para Exploração de Reparações

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

* Criação de um json-server para disponibilizar o ficheiro `dataset_reparacoes.json` através de uma API REST, separando a camada de dados da camada aplicacional.
* Desenvolvimento de um servidor aplicacional em Node.js `server.js` responsável por consumir os dados do json-server.
* O servidor responde a diferentes rotas, devolvendo tabelas HTML geradas dinamicamente com os dados das reparações, tipos de intervenção e viaturas intervencionadas. Implementação da resposta aos endpoints: `/reparacoes`, `/intervencoes` e `/viaturas`

---

## Resultados - Ficheiros Desenvolvidos

#### Servidor Aplicacional

- **server.js**
  Servidor HTTP desenvolvido em Node.js que consome a API do `json-server` via `axios` e responde com tabelas HTML geradas dinamicamente.

  ###### Serviços disponibilizados

  - `/reparacoes`
    Tabela HTML com os dados completos das reparações.
  - `/intervencoes`
    Tabela HTML com tipos de intervenção (sem repetições) e o número de vezes que cada intervenção foi realizada.
  - `/viaturas`
    Tabela HTML com os diferentes tipos de viatura intervencionados e o número de vezes que cada modelo foi reparado.

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
json-server --watch dataset_reparacoes.json 
```

Terminal B — iniciar o servidor aplicacional

```
node server.js
```

Aceder no browser a [http://localhost:7777](http://localhost:7777)

---

**Universidade do Minho - Escola de Engenharia**

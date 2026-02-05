# TPC1: Website de Exploração de Reparações Automóveis

* **Data:** Fevereiro 2026
* **Autor:** Ana Freitas
* **Unidade Curricular:** Engenharia Web

---

## Identificação do Autor
<table>
  <tr>
    <td>

**Nome:** Ana Beatriz Ribeiro Freitas  
**Número:** a106853  
**Curso:** Licenciatura em Engenharia Informática  
**Instituição:** Universidade do Minho  
**Unidade Curricular:** Engenharia Web  

  </td>
  <td align="center">
    <img src="bf.jpeg" alt="Fotografia do autor" width="120"/>
  </td>
  </tr>
</table>
---

## Resumo

* Análise do ficheiro `dataset_reparacoes.json`, identificando a estrutura principal dos dados (reparações, clientes, viaturas e intervenções) e as relações entre eles. A partir dessa análise foi possível definir os campos relevantes para cada tipo de listagem e página individual do website.
* O script começa por carregar o dataset e criar dicionários para indexar intervenções e marcas/modelos, permitindo evitar redundância e facilitar a criação de páginas agregadas e cruzadas entre entidades.
* A cada reparação foi atribuído um identificador único, usado para criar páginas individuais e para estabelecer ligações entre reparações, intervenções e viaturas.
* A página principal, `index.html`, funciona como ponto de entrada do website, apresentando os diferentes conjuntos de dados consultáveis e encaminhando o utilizador para as listagens principais.
* Foram criadas listagens globais para reparações, tipos de intervenção e marcas/modelos, todas ordenadas alfabeticamente ou cronologicamente conforme o contexto, permitindo uma exploração estruturada e intuitiva do dataset.
* Para cada reparação, intervenção e marca/modelo foi gerada uma página individual com informação detalhada.

---

## Resultados - Ficheiros Desenvolvidos

#### Script Desenvolvido

- **json2html.py**
  Script em Python responsável pelo processamento do ficheiro `dataset_reparacoes.json` e por gerar automáticamente todo o website em HTML, incluindo páginas de listagem e páginas individuais.

#### Website Gerado

- **output/**  
  Pasta raiz do website gerado.

- **index.html**  
  Página principal com acesso às diferentes listagens disponíveis.

- **listagem_reparacoes.html**  
  Listagem global das reparações realizadas, com informação resumida de cada uma e ligação para as respetivas páginas individuais.

- **listagem_intervencoes.html**  
  Listagem global dos tipos de intervenção existentes no dataset, com acesso às páginas de detalhe de cada intervenção.

- **listagem_marcas.html**  
  Listagem das marcas e modelos das viaturas intervencionadas, com ligação para o histórico de reparações associado.

- **reparacoes/**  
  Pasta que contém um ficheiro HTML por cada reparação registada no dataset como `rep_1.html`, `rep_2.html`, … Cada ficheiro apresenta a informação completa da reparação, incluindo dados do cliente, viatura e intervenções realizadas.

- **intervencoes/**  
  Pasta que contém um ficheiro HTML por cada tipo de intervenção identificado no dataset, nomeado pelo respetivo código como `I01.html`, `I02.html`, … Cada página descreve a intervenção e apresenta a lista de reparações onde esta foi aplicada.

- **marcas/**  
  Pasta que contém um ficheiro HTML por cada combinação de marca e modelo de viatura como `Toyota_Yaris.html`, `BMW_Serie3.html`, … Cada página apresenta informação da viatura e o histórico de reparações associadas.

#### Documentação

- **README.md**
  Documento que descreve a estrutura do website, a abordagem adotada e o funcionamento do script.

---

**Universidade do Minho - Escola de Engenharia**

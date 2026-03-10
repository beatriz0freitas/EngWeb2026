import json

with open("cinema.json", encoding="utf-8") as f:
    data = json.load(f)

filmes_raw = data["filmes"]

# Validação - todas as palavras começam com maiúscula + Palavras curtas (≤ 3 chars) podem ser minúsculas (preposições em nomes: de, van, al...)
def parece_nome(texto):
    texto = texto.strip()
    palavras = texto.split()
    if not (2 <= len(texto) <= 40) or not any(c.isalpha() for c in texto):
        return False
    if not (1 <= len(palavras) <= 4) or not palavras[0][0].isupper() and not palavras[0][0].isdigit():
        return False
    if palavras[0][0].isdigit() and len(palavras) > 2:
        return False
    return all(p[0].isupper() or p[0].isdigit() or len(p) <= 3 for p in palavras)


def limpar_cast(cast_list):
    """Se a maioria das entradas não parece nome, descarta o cast inteiro."""
    if not cast_list:
        return []
    nomes = [a.strip() for a in cast_list if parece_nome(a)]
    if len(nomes) < len(cast_list) / 2:
        return []
    return nomes


# FILMES: limpar e adicionar id 
filmes = []
for i, f in enumerate(filmes_raw):
    cast_limpo = limpar_cast(f.get("cast", []))
    filmes.append({
        "id": i + 1,
        "title": f.get("title", "Sem título"),
        "year": f.get("year", 0),
        "cast": cast_limpo,
        "genres": [g.strip() for g in f.get("genres", [])]
    })

# Extrair entidades (atores/géneros) a partir dos filmes 
def extrair_entidades(filmes, campo):
    """Extrai lista única ordenada com id, nome e filmes {id, title}."""
    dicionario = {}
    for f in filmes:
        for nome in f[campo]:
            if nome not in dicionario:
                dicionario[nome] = []
            dicionario[nome].append({"id": f["id"], "title": f["title"]})
    return [{"id": i, "name": nome, "films": films}
            for i, (nome, films) in enumerate(sorted(dicionario.items()), 1)]


atores = extrair_entidades(filmes, "cast")
generos = extrair_entidades(filmes, "genres")

# Associar IDs de atores e géneros aos filmes 
for campo, entidades in [("cast", atores), ("genres", generos)]:
    nome_id = {e["name"]: e["id"] for e in entidades}
    for f in filmes:
        f[campo] = [{"id": nome_id[n], "name": n} for n in f[campo]]

res = {
    "filmes": filmes,
    "atores": atores,
    "generos": generos
}

with open("dataset_cinema.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)

print(f"Filmes: {len(filmes)}, Atores: {len(atores)}, Géneros: {len(generos)}")
print("Ficheiro 'dataset_cinema.json' gerado com sucesso.")

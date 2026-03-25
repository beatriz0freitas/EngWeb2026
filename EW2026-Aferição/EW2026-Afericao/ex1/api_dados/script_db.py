import json

with open("dataset_reparacoes.json", encoding="utf-8") as f:
    data = json.load(f)

reparacoes = data["reparacoes"]

for r in reparacoes:
    # 1. Garante que nr_intervencoes bate certo com o array real
    r["nr_intervencoes"] = len(r.get("intervencoes", []))

    # 2. Remove espaços extra no nome do cliente
    r["nome"] = r["nome"].strip()

    # 3. Garante que a matrícula está em maiúsculas e sem espaços
    r["viatura"]["matricula"] = r["viatura"]["matricula"].strip().upper()

    # 4. Garante que a marca está capitalizada (ex: "cadillac" → "Cadillac")
    r["viatura"]["marca"] = r["viatura"]["marca"].strip().title()

    # 5. Garante que o modelo está sem espaços extra
    r["viatura"]["modelo"] = r["viatura"]["modelo"].strip()

    # 6. Garante que os códigos de intervenção estão em maiúsculas
    for i in r.get("intervencoes", []):
        i["codigo"] = i["codigo"].strip().upper()
        i["nome"]   = i["nome"].strip()

print(f"{len(reparacoes)} registos processados")

with open("db_reparacoes.json", "w", encoding="utf-8") as f:
    json.dump(reparacoes, f, ensure_ascii=False, indent=2)

print(f"Ficheiro 'db_reparacoes.json' pronto para importar")
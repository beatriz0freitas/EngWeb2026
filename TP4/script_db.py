import json

with open("emd.json", encoding="utf-8") as f:
    lista = json.load(f)

lista = [{"id": a.pop("_id"), **a} if "_id" in a else a for a in lista]

res = {"emd": lista}

with open("dataset_emd.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)
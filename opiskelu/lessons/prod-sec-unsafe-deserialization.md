# API ottaa base64-kentän ja tekee pickle.loads(base64decode(input)). Miksi vaarallista?

## Tilanne

`pickle.loads(base64decode(input))` — epäluotettava base64-kenttä.

## Ratkaisu

Epäluotettavaa dataa ei saa deserialisoida formaattiin, joka voi suorittaa koodia.

Käytä turvallista dataformaattia kuten JSON, validoi skeema ja käsittele vain odotettuja kenttiä.

[Lue lisää](https://owasp.org/www-project-top-ten/2017/A8_2017-Insecure_Deserialization)

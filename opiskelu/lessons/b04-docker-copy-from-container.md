# Tuotantokontista pitää hakea crash-dump tiedosto hostille. Toimenpide?

## Tilanne
Tuotantokontti kaatui ja generoi heap dumpin `/tmp/heap.hprof` — tiedosto on kontin sisällä, pitää siirtää hostille analyysiin.

Kontti on vielä käynnissä tai stopped-tilassa, mutta tiedostoa ei näy hostilla.

## Ratkaisu
**docker cp kontti:/path/dump ./local/.**

```bash
docker cp my-api:/tmp/heap.hprof ./incident/heap.hprof
```

Toimii myös toiseen suuntaan: `docker cp ./config.yaml my-api:/etc/app/`

docker cp kopioi tiedostoja container↔host — docker cp docs.

## Käytännössä
Dumpit voivat olla suuria — varmista levytila. Tuotannossa harkitse volume mount crash-dumpeille suoraan hostille.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/cp/)

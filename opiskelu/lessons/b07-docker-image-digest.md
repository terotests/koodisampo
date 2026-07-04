# Tuotantoon deployattiin eri image kuin testissä — tag liikkui. Miten lukitset version?

## Tilanne
Tuotantoon deployattiin `myapp:v1.2.3` mutta se käyttäytyy eri tavalla kuin testissä — tag on ylikirjoitettu registryssä uudella buildilla.

## Ratkaisu
**Deploy image digest @sha256:... — tag ei takaa identtistä image-sisältöä.**

```bash
docker pull myregistry/myapp@sha256:abc123...
docker run myregistry/myapp@sha256:abc123...
```

Compose/K8s:

```yaml
image: myregistry/myapp@sha256:abc123def456...
```

Image digest is immutable content address — Docker manifest.

## Käytännössä
CI kirjoittaa digest deploy-manifestiin. Tagit liikkuvat — digest ei. Säilytä digest rollbackia varten.

[Lue lisää](https://docs.docker.com/reference/cli/docker/image/pull/#pull-an-image-by-digest-immutable-identifier)

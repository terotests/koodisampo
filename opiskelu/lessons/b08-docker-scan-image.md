# CI putki — haluat skannata imagen CVE:t ennen deploya. Työkalu ekosysteemissä?

## Tilanne
CI-putki deployaa imagen ilman CVE-tarkistusta. Tuotannossa löytyy kriittinen haavoittuvuus base-imagessa.

## Ratkaisu
**docker scout cve tai Trivy/Snyk-integraatio skannaa imagen CVE:t ennen deploya.**

```bash
docker scout cves myregistry/myapp:latest
trivy image --severity HIGH,CRITICAL myregistry/myapp:latest
```

Docker Scout / third-party scanners — Docker security scanning.

## Käytännössä
Fail build kriittisillä CVE:illä. Pin base-image digest ja skannaa jokainen build. SBOM supply chain -vaatimuksiin.

[Lue lisää](https://docs.docker.com/scout/)

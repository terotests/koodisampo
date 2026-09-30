# Miten Sigstoren 'keyless'-allekirjoitus toimii ilman pitkäikäistä yksityistä avainta?

## Ratkaisu

Toimitusketjuhyökkäykset (paketin korvaaminen, CI-kaappaus) ovat yleistyneet. Sigstore sitoo allekirjoituksen *identiteettiin*: 'tämän paketin rakensi repo X:n workflow Y'. npm:n ja PyPI:n provenance-/attestation-tuet perustuvat samaan ideaan (SLSA-provenance).

## Käytännössä

Varmenna allekirjoitus identiteetin kanssa, esim. cosign verify --certificate-identity ... Pelkkä 'on allekirjoitettu' ei kerro kuka allekirjoitti.


[Lue lisää](https://docs.sigstore.dev/)

# Rebase tehtiin ja branch pitää puskea uudestaan. Miten vältät että ylikirjoitat kollegan commitit vahingossa?

## Tilanne

Teit `git rebase main` feature-branchillesi ja historia muuttui. Tavallinen `git push` hylätään. `git push --force` korjaa tilanteen — mutta jos kollega ehti puskea samaan branchiin välissä, **hänen commitinsa katoavat** remotehistoriasta.

Force push ilman tarkistusta on yleinen tapa tuhoata toisen työ.

## Ratkaisu

```bash
git push --force-with-lease
```

`--force-with-lease` puskee vain jos remote on edelleen sama kuin viimeisimmässä fetchissäsi. Jos joku muu on puskenut väliin, push **hylätään** — sinun täytyy fetchata, integroida ja puskea uudelleen tietoisesti.

```bash
git fetch origin feature
git log origin/feature  # tarkista mitä tuli väliin
```

## Käytännössä

Suojattu branch (main): älä force pushaa lainkaan — käytä merge/PR. Feature-branchit: `--force-with-lease` rebasen jälkeen on ok, kun tiimi tietää käytännön. `--force` ilman leasea vain hätätilanteessa ja yksin työskenneltäessä.

[Lue lisää](https://git-scm.com/docs/git-push)

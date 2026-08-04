# Tuotantodeploy on rikki ja edellinen versio on tunnettu. Nopein turvallinen rollback CI/CD:ssä?

## Tilanne

Uusi deploy aiheuttaa 5xx / data-virheitä. Hotfix tuotannossa pitkittää outagea. Edellinen image-tag tai git-sha tiedetään hyväksi. Tavoite: palauttaa palvelu nopeasti, debuggaa myöhemmin.

## Ratkaisu

**Rollback = tunnettu hyvä versio takaisin:**

1. Deployaa edellinen image **digest**/tag (ei `latest`).
2. Tai `git revert` rikkovalle commitille + pipeline uudelleen — jos infra on gitops.
3. Älä ssh:lla "korjaa livenä" ensisijaisena strategiana.

Esim. Kubernetes: `helm rollback`, `kubectl rollout undo`, tai CD-työkalun "redeploy previous".

## Käytännössä

- Jokainen tuotantoon menevä artefakti pitää olla yksilöitävä (digest), jotta rollback on yksi klikkaus/komento.
- Feature flagit vähentävät rollback-tarvetta, mutta eivät korvaa sitä.
- Incidemin jälkeen: postmortem + forward-fix; ensin palautus.

[Lue lisää](https://sre.google/sre-book/addressing-cascading-failures/)

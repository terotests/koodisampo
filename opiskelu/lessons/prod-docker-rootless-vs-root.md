# Mitä eroa on hostin root-käyttäjällä ja kontin USER rootilla rootless Docker -ympäristössä?

## Tilanne

Kontissa `USER root` (uid 0 namespaceessa). Rootless Dockerissa daemon itse ei ole host-root. Kehittäjä olettää, että "root kontissa = root hostilla" — tai päinvastoin, että kontin root on harmiton. Molemmat ääripäät ovat väärin ilman namespace/capability-ymmärrystä.

## Ratkaisu

Kontin uid 0 on **user-rajattu**: se on root *kontin user namespacessa*, ei automaattisesti hostin root. Rootless-tila lisää kerroksen: Docker-daemon ja kontit pyörivät tavallisen käyttäjän alla; host-root-oikeuksia ei ole ilman erillistä vuotoa/capability-asetusta.

Silti kontin root voi olla vaarallinen *kontin sisällä* (pakettien asennus, raaka-laitteet jos myönnetty). Älä aja sovellusta rootina kontissa ilman syytä — `USER` non-root on edelleen best practice.

## Käytännössä

- Rootless ≠ "kontin root on sama kuin host-root".
- Rootful Docker + `privileged` / host PID network on eri riskiprofiili.
- Capabilities (`CAP_NET_BIND_SERVICE` jne.) rajaavat mitä root kontissa voi tehdä.
- Tuotannossa: non-root USER + minimal base + drop capabilities.

[Lue lisää](https://docs.docker.com/engine/security/rootless/)

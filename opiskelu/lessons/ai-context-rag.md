# Mitä RAG (retrieval-augmented generation) tarkoittaa?

## Ratkaisu

Klassinen RAG: dokumentit pilkotaan paloihin (chunk), paloille lasketaan upotukset (embedding) ja kysymyksen upotusta lähimmät palat liitetään promptiin. Heikkous: pilkkominen voi irrottaa palan asiayhteydestään. Hybridihaku (vektori + BM25) ja uudelleenjärjestys (reranking) parantavat tulosta.

## Käytännössä

Agenteissa kiinteä RAG korvautuu usein hakutyökalulla, jota malli käyttää itse tarpeen mukaan ja jonka kyselyä se voi tarkentaa.


[Lue lisää](https://arxiv.org/abs/2005.11401)

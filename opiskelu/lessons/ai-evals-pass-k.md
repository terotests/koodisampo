# Agentti ratkaisee tehtävän 70 % yrityksistä. Mitä pass^k (kaikki k yritystä onnistuvat) kertoo toisin kuin pass@k?

## Ratkaisu

Agentit ovat epädeterministisiä, joten yksi ajo ei kerro paljon. **pass@k** = todennäköisyys, että vähintään yksi k:sta onnistuu (sopii, kun ihminen valitsee parhaan). **pass^k** = todennäköisyys, että kaikki k onnistuvat (sopii, kun agentin pitää toimia joka kerta).

## Käytännössä

Aja jokainen eval-tapaus useasti ja raportoi hajonta. Pieni muutos yksittäisessä ajossa on usein kohinaa.


[Lue lisää](https://arxiv.org/abs/2107.03374)

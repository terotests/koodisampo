# Miksi TLS-yhteyksissä otetaan jo nyt käyttöön hybridiavaintenvaihto X25519 + ML-KEM?

## Ratkaisu

Riittävän suuri kvanttitietokone murtaisi RSA:n ja elliptisten käyrien kryptografian Shorin algoritmilla. Salattua liikennettä voi tallentaa jo nyt ja purkaa myöhemmin, joten avaintenvaihto on kiireellisin korjattava. Hybridi (klassinen + ML-KEM) on käytössä suurimmissa selaimissa ja CDN-palveluissa.

## Käytännössä

Tarkista kirjastojen tuki (OpenSSL 3.5+, BoringSSL). Suuremmat avainviestit voivat paljastaa keskittimiä, jotka eivät siedä isoja ClientHello-paketteja.


[Lue lisää](https://csrc.nist.gov/pubs/fips/203/final)

# Rust-projekti käyttää 120 cratea. Miten pienennät dependency-riskiä?

## Taustaa

Rust ei poista **supply chain** -riskiä. Crate voi olla haitallinen, ylläpitäjätili voidaan kaapata tai transitiivinen dependency voi sisältää haavoittuvuuden. `Cargo.lock` lukitsee tarkat versiot sovellusprojekteissa — sama commit asentaa saman dependency-puun CI:ssä ja tuotannossa.

Työkalut-osiossa mainitaan `Cargo.lock`, mutta turvallisuusnäkökulma on erillinen: dependency-hygienia on osa palvelun turvallisuusmallia.

## Tilanne

Uusi mikropalvelu riippuu 15 suorasta cratesta, mutta `cargo tree` paljastaa 120 transitiivista riippuvuutta. Kehittäjä lisää "pienen apucraten" ilman code reviewta. Kuukausi myöhemmin CVE ilmestyy syvällä dependency-puussa — et tiedä, käytätkö haavoittuvaa versiota.

```toml
# Cargo.toml — helppo lisätä, vaikea seurata
[dependencies]
helper-crate = "0.3"  # tuo mukanaan 40 transitiivista cratea
```

## Ratkaisu

Hyvä käytäntö:

- committoi `Cargo.lock` sovellusprojekteissa (binäärit ja deployattavat palvelut)
- pidä dependencyt tarkoituksella vähäisinä — arvioi jokainen uusi crate
- tarkista uudet crate-lisäykset code reviewssä (`cargo tree -i new-crate`)
- käytä `cargo audit` tai `cargo deny` CI:ssä tunnettujen CVE:iden varalta
- vältä turhia featureitä — ne vetävät mukaan lisää koodia
- käytä `default-features = false`, jos crate tuo liikaa mukana

```bash
cargo audit
cargo deny check advisories licenses bans
```

## Käytännössä

Kirjastot (julkaistavat cratet) eivät yleensä commitoi `Cargo.lock`:ia — sovellusprojektit commitoivat. CI:ssä käytä `cargo build --locked`, jotta lockfile ei muutu huomaamatta.

Dependency-päivitykset PR:llä, ei suoraan tuotantoon. Harkitse `cargo-vet` tai sisäistä allowlistia kriittisille cratelle. Pienempi pinta-ala = vähemmän ylläpidettävää ja vähemmän hyökkäyspintaa.

[Lue lisää](https://rustsec.org/)

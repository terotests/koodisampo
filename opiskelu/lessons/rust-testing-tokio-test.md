# Testaat async-funktiota joka käyttää tokio::time::sleep. Miten ajat sen testissä?

## Taustaa

Async-funktiot palauttavat `Future`-tyypin — niitä ei voi kutsua suoraan tavallisesta `#[test]`-funktiosta. Future tarvitsee **executorin**, joka ajaa sen `.await`-pisteisiin asti. Tuotantokoodissa runtime luodaan `#[tokio::main]`-makrolla; testeissä vastine on **`#[tokio::test]`**.

Tokio-test-makro luo kevyen runtime-ympäristön jokaiselle testille, ajaa async-testifunktion ja raportoi tulokset. Se vaatii `tokio`-craten dev-dependenciesiin featureilla `rt` (runtime) ja `macros` (test-makro).

## Tilanne

Funktio `fetch_user` tekee async HTTP-haun ja odottaa vastausta. Testissä haluat varmistaa, että se palauttaa oikean käyttäjän mockattavalla clientilla. Tavallinen synkroninen testi antaa kääntäjävirheen:

```rust
#[test]
fn fetch_returns_user() {
    let user = fetch_user(1).await;  // VIRHE: await vain async fn:ssä
}
```

Async-funktiota ei voi ajaa ilman runtimea.

## Ratkaisu

Käytä `#[tokio::test]`-makroa:

```rust
#[tokio::test]
async fn fetch_returns_user() {
    let mock = setup_mock_client();
    let user = fetch_user(&mock, 1).await.unwrap();
    assert_eq!(user.name, "Maija");
}

#[tokio::test]
async fn fetch_handles_timeout() {
    let slow_mock = setup_slow_mock();
    let result = fetch_user(&slow_mock, 1).await;
    assert!(result.is_err());
}
```

`Cargo.toml`:

```toml
[dev-dependencies]
tokio = { version = "1", features = ["rt", "macros", "time"] }
```

Nopeisiin testeihin yksittäinen säie riittää:

```rust
#[tokio::test(flavor = "current_thread")]
async fn fast_unit_test() {
    assert_eq!(async_add(1, 2).await, 3);
}
```

## Käytännössä

Sleep-pohjaiset testit hidastuvat oikealla odotuksella. Tokio tarjoaa testeihin **aikamatkustuksen**:

```rust
#[tokio::test(start_paused = true)]
async fn retry_after_delay() {
    tokio::time::sleep(Duration::from_secs(60)).await;  // ei odota oikeasti 60 s
    assert!(service.ready().await);
}
```

`start_paused = true` + `tokio::time::advance()` nopeuttaa ajastinpohjaiset testit. Yhdistä mock-trait + `#[tokio::test]` eristettyyn async-testaukseen. Integraatiotestit `tests/`-hakemistossa tukevat samaa makroa.

[Lue lisää](https://docs.rs/tokio/latest/tokio/attr.test.html)

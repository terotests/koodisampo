# Haluat korvata HTTP-clientin testissä ilman oikeaa verkkoa. Mikä pattern Rustissa?

## Tilanne

Service riippuu HttpClient-traitista — tuotannossa reqwest, testissä fake.

## Ratkaisu

```rust
#[automock]
trait HttpClient { async fn get(&self, url: &str) -> Result<String>; }
// testissä: MockHttpClient::new().expect_get().returning(|_| Ok("ok".into()));
```

## Käytännössä

Pieni trait testattavalle rajapinnalle. Vältä mockaamasta kaikkea — integration testit oikealla IO:lla.

[Lue lisää](https://docs.rs/mockall/latest/mockall/)

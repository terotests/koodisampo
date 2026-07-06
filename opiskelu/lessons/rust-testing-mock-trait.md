# Haluat korvata HTTP-clientin testissä ilman oikeaa verkkoa. Mikä pattern Rustissa?

## Taustaa

Testattava koodi riippuu usein ulkoisista palveluista — HTTP-API, tietokanta, tiedostojärjestelmä. **Oikea verkko testeissä** on hidas, epäluotettava (flaky) ja vaatii infrastruktuuria. Ratkaisu on **riippuvuuksien injektointi**: tuotantokoodi riippuu abstraktiosta (trait), testissä injektoit fake-toteutuksen.

Rustissa trait + mock-kirjasto on idiomaattinen malli. **mockall** generoi mock-toteutuksen traitista `#[automock]`-makrolla — määrittelet odotukset (`expect_get().returning(...)`) ja varmistat, että oikeat metodit kutsuttiin oikeilla parametreilla.

## Tilanne

`UserService` hakee käyttäjätiedot HTTP:llä. Tuotannossa käytät `reqwest`-clienttia. Testissä et halua oikeaa verkkopyyntöä — CI:ssä ei ole ulkoista API:a, ja testit eivät saa riippua verkon tilasta. Palvelu pitää testata eristettynä.

```rust
// Huono: UserService kutsuu suoraan reqwest::get — ei mockattavissa
```

## Ratkaisu

Määrittele trait ja mockaa se:

```rust
use mockall::automock;

#[automock]
#[async_trait::async_trait]
pub trait HttpClient: Send + Sync {
    async fn get(&self, url: &str) -> Result<String, reqwest::Error>;
}

pub struct UserService<C: HttpClient> {
    client: C,
}

impl<C: HttpClient> UserService<C> {
    pub async fn fetch_name(&self, id: u64) -> Result<String, reqwest::Error> {
        let body = self.client.get(&format!("/users/{id}")).await?;
        Ok(parse_name(&body))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn fetch_name_returns_parsed_name() {
        let mut mock = MockHttpClient::new();
        mock.expect_get()
            .with(mockall::predicate::eq("/users/1"))
            .returning(|_| Ok(r#"{"name":"Maija"}"#.into()));

        let service = UserService { client: mock };
        assert_eq!(service.fetch_name(1).await.unwrap(), "Maija");
    }
}
```

## Käytännössä

Pidä trait **pienenä** — testattava rajapinta, ei koko reqwest-API. Vältä mockaamasta kaikkea: joitain polkuja kannattaa testata integraatiotestillä oikealla I/O:lla (esim. paikallinen testipalvelin).

Vaihtoehtoja mockallille: manuaalinen fake-struct, `wiremock` HTTP-tason mockaukseen, `httpmock`. Valitse taso: trait-mock yksikkötesteihin, wiremock integraatiotesteihin. `#[automock]` vaatii `mockall`-craten dev-dependenciesiin.

[Lue lisää](https://docs.rs/mockall/latest/mockall/)

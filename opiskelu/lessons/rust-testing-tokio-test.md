# Testaat async-funktiota joka käyttää tokio::time::sleep. Miten ajat sen testissä?

## Tilanne

fetch_user().await testissä — #[test] antaa virheen async fn signaturesta.

## Ratkaisu

```rust
#[tokio::test]
async fn fetch_returns_user() {
    let user = fetch_user(1).await.unwrap();
    assert_eq!(user.name, "Maija");
}
```

## Käytännössä

#[tokio::test(flavor = "current_thread")] nopeisiin testeihin.

[Lue lisää](https://docs.rs/tokio/latest/tokio/attr.test.html)

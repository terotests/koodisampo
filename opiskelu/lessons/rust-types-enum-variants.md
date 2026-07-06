# Mikä enum-malli mallintaa HTTP-vastauksen statuskoodin ja bodyn yhdessä tyypissä?

## Tilanne

API palauttaa joko datan tai virhekoodin — käytät erillisiä kenttiä ja `has_error: bool`.

## Ratkaisu

```rust
enum ApiResponse {
    Success(String),
    Error(u16),
}
```
Pattern match pakottaa käsittelemään molemmat.

## Käytännössä

Option ja Result ovat std-enumeja. Omat domain-virheet: `enum AppError { ... }`.

[Lue lisää](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html)

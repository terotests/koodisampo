# Miksi `&Vec<T>` funktioparametrina on usein huono verrattuna `&[T]`:hen?

## Tilanne

Funktio laskee summan — kutsutaan sekä `Vec<i32>`:llä että `[i32; 4]`:llä.

## Ratkaisu

```rust
fn sum(nums: &[i32]) -> i32 { nums.iter().sum() }

sum(&vec![1,2]);
sum(&[1, 2, 3, 4]);
```

## Käytännössä

Sama pätee `&String` vs `&str`. Prefer slice/str over owned container references.

[Lue lisää](https://doc.rust-lang.org/book/ch04-03-slices.html)

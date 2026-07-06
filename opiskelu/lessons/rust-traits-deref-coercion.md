# Funktio odottaa `&str` mutta saat `&String`. Miksi koodi kääntyy?

## Tilanne

`fn foo(s: &str)` kutsutaan `foo(&my_string)` ilman `.as_str()`.

## Ratkaisu

String impl Deref<Target=str>. Coercion myös Vec → &[T], Box → &T.

## Käytännössä

Älä yli-Deref — anti-pattern smart pointereille paitsi transparenssi.

[Lue lisää](https://doc.rust-lang.org/book/ch15-02-deref.html)

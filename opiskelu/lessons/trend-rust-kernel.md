# Miksi Linux-ytimeen hyväksytään nykyään Rustilla kirjoitettuja ajureita?

## Ratkaisu

Rust-tuki tuli ytimeen versiossa 6.1 (2022) kokeiluna. Sen jälkeen mukaan on tullut ajureita (esim. NVIDIA-näytönohjainten Nova, Applen GPU-ajuri kehityksessä, Android Binder), ja kokeiluvaihe on julistettu päättyneeksi. Rust-koodi käyttää C-ytimen rajapintoja turvallisten abstraktioiden kautta.

## Käytännössä

Rajapinta C:n ja Rustin välillä (unsafe-lohkot) on kriittisin kohta. Turvallisuus riippuu siitä, että abstraktiot on tehty oikein.


[Lue lisää](https://docs.kernel.org/rust/index.html)

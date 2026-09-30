# Agentti ajaa itse kirjoittamaansa koodia. Missä se kannattaa ajaa?

## Ratkaisu

Eristyksen kaksi tärkeintä ulottuvuutta: **tiedostojärjestelmä** (vain projektihakemisto kirjoitettavissa) ja **verkko** (proxy/allowlist, jotta data ei vuoda). Toteutus voi olla kontti, mikro-VM, gVisor tai käyttöjärjestelmän sandbox (bubblewrap, macOS Seatbelt).

## Käytännössä

Hyvä eristys vähentää lupakyselyjä: kun vahinko on rajattu, agentti voi toimia vapaammin hiekkalaatikon sisällä.


[Lue lisää](https://docs.claude.com/en/docs/claude-code/sandboxing)

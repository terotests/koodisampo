# Local-first-sovelluksessa kaksi käyttäjää muokkaa samaa dokumenttia offline-tilassa. Mitä CRDT:t ratkaisevat?

## Ratkaisu

Local-first: data asuu ensin käyttäjän laitteella, sovellus toimii offline-tilassa, ja synkronointi on taustatoiminto. CRDT-kirjastot (Automerge, Yjs, Loro) mallintavat tekstiä, listoja ja mappeja niin, että kaikki replikat päätyvät samaan tilaan saatuaan samat muutokset.

## Käytännössä

CRDT takaa yhtenevyyden, ei sitä että tulos on käyttäjän mielestä järkevä. Esim. samanaikaiset ristiriitaiset kentän arvot vaativat UI:n ratkaisun.


[Lue lisää](https://crdt.tech/)

# Miksi passkeyt (WebAuthn/FIDO2) kestävät kalastelua paremmin kuin salasana + SMS-koodi?

## Ratkaisu

Passkey on julkisen avaimen tunniste: palvelin tallentaa vain julkisen avaimen, yksityinen pysyy laitteella tai synkronoidussa avainnipussa. Kirjautuessa laite allekirjoittaa palvelimen haasteen, ja selain varmistaa että sivusto vastaa tunnisteen RP ID:tä. Palvelinvuodossa ei vuoda mitään käyttökelpoista.

## Käytännössä

Ota passkeyt käyttöön salasanan rinnalle ja huolehdi palautusreitistä, jos käyttäjä menettää laitteensa.


[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)

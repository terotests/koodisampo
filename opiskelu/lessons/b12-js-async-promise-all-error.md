# Promise.all — yksi reject. Mitä tapahtuu?

## Tilanne

Deploy-skripti odottaa viittä health check -kutsua Promise.all:lla. Yksi palvelu on alhaalla — koko deploy keskeytyy ilman tietoa siitä, mitkä neljä muuta ovat kunnossa.

## Ratkaisu

**Promise.all — yksi reject hylkää koko all:in:**

```javascript
try {
  const results = await Promise.all([
    checkServiceA(),
    checkServiceB(),
    checkServiceC(),
  ]);
} catch (err) {
  // Ensimmäinen virhe — muut tulokset häviävät
  console.error("Health check failed:", err);
}
```

Koko `all` hylätään heti ensimmäisen rejectin syyllä — et saa muiden tuloksia. Huomaa, että Promise.all ei peruuta muita promiseja: kutsut jatkuvat taustalla, mutta niiden tulokset jäävät käyttämättä.

## Käytännössä

Promise.all = "kaikkien onnistuminen pakollinen". Osittaisiin tuloksiin → Promise.allSettled. Deploy/health check → allSettled + raportti per palvelu. Parallel fetch riippumattomille resursseille → all on OK.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

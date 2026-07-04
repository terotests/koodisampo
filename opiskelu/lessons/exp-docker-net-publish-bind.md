# Palvelu kuuntelee vain localhostia kontissa mutta hostilta ei reach. Mikä publish-syntaksi?

## Tilanne

Node-sovellus kontissa kuuntelee porttia 8080:

```javascript
app.listen(8080, '127.0.0.1');
```

Kontti käynnistyy ilman porttimääritystä:

```bash
docker run -d myweb:latest
```

Hostilta `curl http://localhost:8080` epäonnistuu — palvelu on kontissa, mutta porttia ei ole julkaistu hostille. Bridge-verkossa kontti on erillinen verkkonimiavaruus; ilman publishia host ei pääse siihen.

## Ratkaisu

**`-p 8080:8080`** mapaa host-portin kontin porttiin. `-p host:container` publishaa portin NAT:lla bridge-verkossa.

```bash
docker run -d -p 8080:8080 myweb:latest
curl http://localhost:8080
```

Jos sovellus kuuntelee vain `127.0.0.1` kontissa, publish toimii silti — NAT ohjaa liikenteen kontin loopbackiin. Parempi käytäntö on kuunnella `0.0.0.0`:

```javascript
app.listen(8080, '0.0.0.0');
```

Tietylle interface:lle: `-p 127.0.0.1:8080:8080`.

## Käytännössä

`EXPOSE 8080` Dockerfilessa dokumentoi portin, mutta ei julkaise sitä — tarvit aina `-p` tai Compose `ports:`. Tuotannossa rajoita bind-osoite (`127.0.0.1`) jos reverse proxy on samalla hostilla.

[Lue lisää](https://docs.docker.com/network/port-mapping/)

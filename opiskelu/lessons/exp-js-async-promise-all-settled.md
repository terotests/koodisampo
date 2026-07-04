# Dashboard hakee viisi API:a — yksi failaa ja koko näkymä jää tyhjäksi Promise.all:in takia. Parempi malli?

## Tilanne

Admin-dashboard hakee viisi riippumatonta metriikkaa eri palveluista: käyttäjämäärä, liikevaihto, virheloki, välimuisti, latenssi. `Promise.all` odottaa kaikkia — kun yksi palvelu palauttaa 503, koko näkymä jää tyhjäksi vaikka neljä muuta onnistui.

Tuotantotuki valittaa, ettei dashboardista näe mitään osittaisen katkon aikana.

## Ratkaisu

**Käytä Promise.allSettled — käsittele jokainen tulos erikseen.**

```javascript
const results = await Promise.allSettled([
  fetchUsers(),
  fetchRevenue(),
  fetchErrors(),
  fetchCache(),
  fetchLatency(),
]);

for (const result of results) {
  if (result.status === "fulfilled") {
    renderWidget(result.value);
  } else {
    renderWidgetError(result.reason);
  }
}
```

`allSettled` ei hylkää muita kun yksi epäonnistuu — saat `{ status, value|reason }` jokaiselle.

## Käytännössä

Dashboardeissa ja aggregaattinäkymissä `allSettled` on lähes aina oikea valinta. `Promise.all` sopii vain tilanteisiin, joissa kaikkien onnistuminen on pakollinen (esim. transaktio). Nimeä widgetit selkeästi, jotta osittainen failure on ymmärrettävä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

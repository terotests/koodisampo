# Kolme riippumatonta API-kutsua — haluat odottaa kaikkia mutta yksi fail saa jatkua. Metodi?

## Tilanne

Checkout-sivu hakee kolme riippumatonta resurssia: toimitusvaihtoehdot, veroprosentin ja kampanjakoodin validoinnin. Yksi ulkoisista palveluista on epävakaa — joskus se timeouttaa.

Tiimi haluaa näyttää kaikki onnistuneet tiedot vaikka yksi palvelu failaisi — ei tyhjää sivua.

## Ratkaisu

**Promise.allSettled odottaa kaikkia riippumatta yksittäisistä virheistä:**

```javascript
const [shipping, tax, promo] = await Promise.allSettled([
  fetchShippingOptions(),
  fetchTaxRate(),
  validatePromoCode(code),
]);

if (shipping.status === "fulfilled") renderShipping(shipping.value);
if (tax.status === "fulfilled") renderTax(tax.value);
if (promo.status === "fulfilled") applyPromo(promo.value);
```

`Promise.all` hylkäisi koko ketjun ensimmäisestä virheestä — ei sopiva tähän.

## Käytännössä

Valitse all vs allSettled tietoisesti: all kun kaikki tarvitaan onnistuneina, allSettled kun osittainen tulos on hyödyllinen. Dokumentoi valinta koodikommentissa — se auttaa seuraavaa lukijaa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

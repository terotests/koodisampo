# 64-bit ID ylittää Number.MAX_SAFE_INTEGER — JSON API palauttaa ison numeron. Tyyppi?

## Tilanne

Sosiaalisen median integraatio palauttaa viestin ID:n:

```javascript
const data = JSON.parse('{"messageId": 18446744073709551615}');
console.log(data.messageId); // 18446744073709552000 — pyöristetty!
```

Kun ID ylittää `Number.MAX_SAFE_INTEGER` (9007199254740991), JavaScriptin double ei enää esitä jokaista kokonaislukua. Seuraava API-kutsu väärällä ID:llä epäonnistuu hiljaisesti tai palauttaa väärän viestin.

## Ratkaisu

**BigInt — 123n tai BigInt(string) — älä sekoita Numberiin ilman tarkistusta:**

```javascript
// API palauttaa merkkijonona (paras)
const id = BigInt(data.messageId); // "18446744073709551615"

// Tai literaali
const id = 18446744073709551615n;

// Vertailu
id === 18446744073709551615n; // true

// API-kutsu
fetch(`/messages/${id.toString()}`);
```

BigInt tukee mielivaltaisen tarkkuuden kokonaislukuja — juuri 64-bit ID:itä varten.

## Käytännössä

Älä sekoita BigInt:iä ja Number:ia samassa laskutoimituksessa ilman eksplisiittistä muunnosta. JSON.stringify vaatii custom replacerin BigIntille.

MDN: pidä ID merkkijonona JSONissa, jos backend sallii — se yksinkertaistaa koko pinon.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

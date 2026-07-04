# fetch-ketju kaatuu — virhe jää käsittelemättä ja UI jää spinneriin. Korjaus?

## Tilanne

Tuotesivu hakee datan fetch-ketjulla:

```javascript
fetch("/api/product/123")
  .then((res) => res.json())
  .then((data) => renderProduct(data))
  .then(() => hideSpinner());
```

Kun API palauttaa 404, spinner pyörii ikuisesti — virhe jää käsittelemättä ja konsoliin tulee unhandled rejection.

## Ratkaisu

**.catch() ketjun lopussa tai try/catch async-funktiossa:**

```javascript
fetch("/api/product/123")
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then((data) => renderProduct(data))
  .catch((err) => {
    hideSpinner();
    showError(err.message);
  });
```

Async/await-vastine:

```javascript
try {
  const res = await fetch("/api/product/123");
  const data = await res.json();
  renderProduct(data);
} catch (err) {
  showError(err.message);
} finally {
  hideSpinner();
}
```

## Käytännössä

Aina catch tai finally spinnerin piilottamiseen. Tarkista res.ok ennen json()-kutsua — fetch ei rejectaa 4xx/5xx:llä. Yksi catch ketjun lopussa riittää — ei joka theniin erikseen.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

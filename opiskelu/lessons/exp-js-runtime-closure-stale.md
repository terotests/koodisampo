# React bugi: useEffect closure näkee vanhan `count`-arvon — interval loggaa 0 ikuisesti. Miksi?

## Tilanne

React-komponentissa laskuri ja interval:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // aina 0
      setCount(count + 1); // ei kasva oikein
    }, 1000);
    return () => clearInterval(id);
  }, []); // tyhjät deps
}
```

Interval käynnistyy kerran mountissa. Closure sieppaa render-hetken `count === 0` eikä koskaan näe päivittynyttä arvoa — klassinen stale closure.

## Ratkaisu

Syy on **stale closure — päivitä deps-array tai käytä funktionaalista updatea**:

```javascript
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // funktionaalinen update
  }, 1000);
  return () => clearInterval(id);
}, []); // count ei tarvita closureen
```

Tai lisää `count` deps-arrayhin ja hyväksy intervalin uudelleenkäynnistys.

## Käytännössä

React DevTools + `eslint-plugin-react-hooks` varoittavat puuttuvista depeistä. Funktionaalinen `setState(fn)` on usein paras, kun vanha arvo tarvitaan. Ref (`countRef.current`) sopii harvinaisiin tapauksiin, joissa interval ei saa resetoitua.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

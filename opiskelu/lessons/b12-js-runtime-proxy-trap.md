# Haluat logata kaikki objektin property-luvut debugissa. Metaprogramming-ratkaisu?

## Tilanne

Debuggaat tuntematonta kolmannen osapuolen objektia, johon propertyt luetaan satunnaisesti. Haluat lokittaa jokaisen `get`-operaation ilman että muutat alkuperäistä koodia.

## Ratkaisu

**new Proxy(target, { get(t, prop, r) { log(prop); return Reflect.get(t, prop, r) } })** — get-trap saa argumentteina kohdeobjektin, property-nimen ja receiverin:

```javascript
const logged = new Proxy(config, {
  get(target, prop, receiver) {
    console.log("GET", prop);
    return Reflect.get(target, prop, receiver);
  },
});
```

## Käytännössä

Proxy ja Reflect ovat ES2015-ominaisuuksia, joten ne toimivat kaikissa moderneissa ympäristöissä. Käytä `Reflect`-metodeja trap:eissa oikean `this`-sidonnan vuoksi. Vue 3 reactivity ja Immer käyttävät Proxya sisäisesti. Proxy ei toimi kaikilla objekteilla (esim. tietyt native objektit).

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

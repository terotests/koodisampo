# API wrapper haluaa säilyttää alkuperäisen virheen ketjun loggauksessa. ES2022?

## Tilanne

API-wrapper kaappaa virheet ja heittää domain-spesifisen virheen:

```javascript
try {
  await fetch("/api/users");
} catch (err) {
  throw new Error("UserService: haku epäonnistui");
  // alkuperäinen err.stack katoaa lokeista
}
```

Sentry näyttää vain wrapper-virheen ilman juurisyytä.

## Ratkaisu

ES2022: **throw new Error('context', { cause: originalError })**:

```javascript
} catch (err) {
  throw new Error("UserService: haku epäonnistui", { cause: err });
}
// err.cause säilyttää alkuperäisen virheen
```

## Käytännössä

Sentry ja modernit loggaajat lukevat `error.cause`-ketjun. Ketjuta cause vain oikeille wrapper-virheille — älä luo syklisiä viittauksia. Node 16.9+ ja kaikki modernit selaimet tukevat tätä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)

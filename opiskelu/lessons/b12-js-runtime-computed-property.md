# Objekti { [key]: value } — mitä hakasulut tekevät?

## Tilanne

Dynaminen API-kenttä objektiliteraalissa:

```javascript
const field = "email";
const user = {
  field: "static", // avain on kirjaimellisesti "field"
};
```

Haluat avaimen arvon muuttujasta `field`.

## Ratkaisu

**Computed property name — dynaaminen avain**:

```javascript
const user = {
  [field]: "ada@example.com",
  [`${field}Verified`]: true,
};
// { email: "...", emailVerified: true }
```

## Käytännössä

Computed nimet toimivat myös class-kentissä ja destructuringissa. Hyödyllinen reducer-actioneissa `{ [action.type]: handler }`. Symbol-avaimet: `{ [Symbol.iterator]: fn }`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)

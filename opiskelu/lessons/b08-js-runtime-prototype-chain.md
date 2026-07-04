# `obj.toString()` toimii vaikka obj:ssa ei ole toString — miten?

## Tilanne

Opiskelija luo tyhjän objektin:

```javascript
const obj = { name: "Ada" };
console.log(obj.toString()); // "[object Object]"
console.log("toString" in obj); // true
console.log(obj.hasOwnProperty("toString")); // false
```

Metodi löytyy, vaikka sitä ei ole määritelty suoraan objektissa.

## Ratkaisu

**Prototype chain — etsitään obj.__proto__ → Object.prototype**:

```javascript
Object.getPrototypeOf(obj) === Object.prototype; // true
obj.toString === Object.prototype.toString; // true
```

Property lookup kulkee prototyyppiketjua pitkin kunnes avain löytyy tai ketju loppuu.

## Käytännössä

`obj.hasOwnProperty(key)` erottaa omat vs perityt. `Object.create(null)` luo objektin ilman prototyyppiä — hyvä sanakirjoille. class-syntaksi asettaa prototyypin automaattisesti.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

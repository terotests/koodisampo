# Vite/CSS import komponentissa?

## Tilanne

React/Vue-komponentti tarvitsee omat tyylinsä:

```javascript
// Button.jsx
export function Button() {
  return <button className="btn">Click</button>;
}
```

Tyylit ovat erillisessä tiedostossa — miten tuoda ne moduulijärjestelmään?

## Ratkaisu

**CSS import** moduulina — bundleri käsittelee:

```javascript
// Button.jsx
import './Button.css';

export function Button() {
  return <button className="btn">Click</button>;
}
```

Vite (ja webpack css-loader) injektoi tyylit DOM:iin build/dev-aikana. Import on side-effect — ei tarvitse muuttujaa.

CSS Modules: `import styles from './Button.module.css'` → `className={styles.btn}`.

## Käytännössä

Merkitse CSS side-effectiksi `package.json`: `"sideEffects": ["**/*.css"]` tree-shakingia varten. Vite tukee myös `?inline` ja SCSS/Less suoraan. Tuotannossa CSS erotetaan usein omana chunkina.

[Lue lisää](https://vitejs.dev/guide/features.html#css)

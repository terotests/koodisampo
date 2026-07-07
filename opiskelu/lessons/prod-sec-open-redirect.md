# Login ohjaa: /login?next=https://evil.example/phish. Mikä riski ja korjaus?

## Tilanne

`/login?next=https://evil.example/phish`

## Ratkaisu

**Open redirect** — käytetään phishingissä.

- Salli vain suhteelliset sisäiset polut
- Tai käytä allowlistattuja domaineja
- Normalisoi URL ennen tarkistusta

```ts
function safeRedirect(next) {
  if (!next || !next.startsWith("/")) return "/";
  if (next.startsWith("//")) return "/";
  return next;
}
```

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)

# GET /api/users?sort=name — koodi: db.query(`SELECT * FROM users ORDER BY ${req.query.sort}`). Miksi prepared statement ei yksin auta?

## Tilanne

```http
GET /api/users?sort=name
```

```js
db.query(`SELECT * FROM users ORDER BY ${req.query.sort}`)
```

## Ratkaisu

Prepared statement ei auta, koska **sarakkeen nimeä ei voi parametrisoida** samalla tavalla kuin arvoa. Käytä whitelistaa:

```ts
const allowedSorts = { name: "name", created: "created_at" };
const sort = allowedSorts[req.query.sort] ?? "created_at";
db.query(`SELECT * FROM users ORDER BY ${sort}`);
```

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

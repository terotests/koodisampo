# Tuotannon Stripe-avain on kovakoodattu: const stripeKey = 'sk_live_...'. Mitä teet?

## Tilanne

`const stripeKey = "sk_live_..."` kovakoodattuna repoon.

## Ratkaisu

- Poista secret koodista
- Kierrätä avain heti — git-historiaan jäänyt secret on vuotanut
- Käytä secret manageria tai ympäristökohtaista injektointia
- Rajaa avaimen oikeudet
- Lokita käyttö ja seuraa väärinkäyttöä

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

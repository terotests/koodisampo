# Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu auttaa löytämään syyllisen commitin?

**Ratkaisu:** `git bisect` — binäärihaku hyvän ja huonon revision välillä.

```bash
git bisect start
git bisect bad          # nykyinen rikki
git bisect good v1.0    # viimeinen toimiva
# testaa → git bisect good/bad kunnes syyllinen löytyy
```

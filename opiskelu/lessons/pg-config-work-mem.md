# Raskas ORDER BY + hash join spillaavat levylle. Mikä istuntotason asetus auttaa ensin?

**Ratkaisu:** nosta `work_mem` istunnolle — sort/hash saavat enemmän RAM:ia ennen temp file -spill:iä.

```sql
SET work_mem = '256MB';  -- vain tämä query / session
```

Varo globaalia nostoa — jokainen sort/hash voi käyttää tämän verran.

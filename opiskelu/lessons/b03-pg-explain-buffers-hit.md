# EXPLAIN ANALYZE näyttää hitaudesta — haluat tietää cache hit vs disk read. Lippu?

**Ratkaisu:** `EXPLAIN (ANALYZE, BUFFERS)` — `BUFFERS` näyttää shared/local hitit ja readit.

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

`shared hit` = data cachesta; `read` = levyltä.

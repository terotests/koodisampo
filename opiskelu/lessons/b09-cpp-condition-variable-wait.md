# Worker-säie odottaa queuea — spurious wakeup aiheuttaa tyhjän pop:in. Oikea wait-pattern?

**Ratkaisu:** predikaatti `wait`-kutsussa:

```cpp
cv.wait(lock, [&] { return !queue.empty(); });
```

Spurious wakeup on sallittu standardissa — tarkista ehto aina ennen `pop()`:ia.

# Lazy-load kuvat kun scrollaa näkyviin. API?

## Tilanne

Tuotesivulla 200 tuotekuvaa. Kaikki latautuvat heti — LCP huononee ja mobiilidata kuluu turhaan.

## Ratkaisu

**IntersectionObserver + data-src**:

```javascript
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const img = e.target;
    img.src = img.dataset.src;
    io.unobserve(img);
  }
});
document.querySelectorAll("img[data-src]").forEach(img => io.observe(img));
```

## Käytännössä

Native `loading="lazy"` riittää monissa tapauksissa. `rootMargin` esilataa ennen näkyvyyttä. `content-visibility: auto` CSS:llä complementoi observeria. Poista observer unmountissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

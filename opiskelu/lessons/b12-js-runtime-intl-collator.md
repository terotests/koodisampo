# Järjestät suomenkielisiä nimiä — localeCompare vs Intl.Collator?

## Tilanne

Järjestät 10 000 suomenkielistä nimeä taulukossa:

```javascript
names.sort((a, b) => a.localeCompare(b, "fi"));
```

Sort on hidas, koska `localeCompare` luo uuden Collatorin joka vertailussa (engine-optimoinnista riippuen).

## Ratkaisu

**Intl.Collator('fi') tehokkaampi toistuvassa sortissa**:

```javascript
const collator = new Intl.Collator("fi");
names.sort((a, b) => collator.compare(a, b));
```

## Käytännössä

Collator-instanssi on kallis luoda kerran, halpa käyttää monta kertaa. `sensitivity: "base"` ohittaa aksentit. `numeric: true` järjestää "2" ennen "10". Testaa locale-spesifiset tapaukset (å, ä, ö).

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)

# Miksi hook (esim. PreToolUse) on parempi kuin promptin ohje 'aja formatter aina muokkauksen jälkeen'?

## Ratkaisu

Hookit ovat laajennuspisteitä agentin elinkaaressa: ennen työkalukutsua (esto/muokkaus), sen jälkeen (formatointi, lint), session alussa (ympäristön valmistelu) ja lopussa. Ne muuttavat 'yleensä' muotoon 'aina'.

## Käytännössä

Käytä hookeja sääntöihin, jotka on pakko pitää. Estävän hookin palaute kannattaa kirjoittaa mallille ymmärrettäväksi, jotta se osaa korjata toimintansa.


[Lue lisää](https://docs.claude.com/en/docs/claude-code/hooks)

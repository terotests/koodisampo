# Miten agentin shell-komentojen oikeudet kannattaa järjestää?

## Ratkaisu

Human-in-the-loop toimii vain, jos kysymyksiä on sopivasti. Liian moni kysely opettaa painamaan 'kyllä' lukematta. Tyypillinen malli: allow-lista (git status, npm test), deny-lista (rm -rf /, curl | sh) ja muut kysytään.

## Käytännössä

Tarkista komennot jäsennettynä, ei merkkijonovertailulla. `git status; rm -rf ~` ei saa läpäistä git status -sääntöä.


[Lue lisää](https://docs.claude.com/en/docs/claude-code/hooks)

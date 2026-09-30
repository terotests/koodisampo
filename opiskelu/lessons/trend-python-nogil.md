# Mitä Pythonin free-threaded-käännös (PEP 703) muuttaa?

## Ratkaisu

Global Interpreter Lock on estänyt CPU-sidonnaista rinnakkaisuutta säikeillä. Free-threaded-käännös (`python3.14t`) korvaa GIL:n hienojakoisemmalla lukituksella. Hintana on hieman hitaampi yksisäikeinen suoritus, ja C-laajennusten on ilmoitettava tukevansa tilaa.

## Käytännössä

Tarkista riippuvuuksien tuki ennen siirtymistä. Jaettu muuttuva tila vaatii nyt oikeaa synkronointia, koska GIL ei enää suojaa sitä sattumalta.


[Lue lisää](https://peps.python.org/pep-0703/)

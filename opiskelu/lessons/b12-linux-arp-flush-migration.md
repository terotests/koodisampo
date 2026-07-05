# VM siirrettiin toiseen hypervisorille — vanhat MAC-osoitteet jäävät ARP-cacheen. Turvallisin tyhjennys?

## Tilanne

Virtuaalikone siirrettiin live-migraatiolla tai cold-migratiolla uuteen hostiin. Verkkoliikenne menee edelleen vanhaan MAC-osoitteeseen tai naapurit vastaavat väärään laitteeseen. ARP-cache sisältää vanhentuneita merkintöjä.

Reboot tyhjentää cachen, mutta tuotannossa se ei ole ensisijainen vaihtoehto.

## Ratkaisu

Tyhjennä vain kyseisen rajapinnan cache:

```bash
ip neigh flush dev eth0
```

Yksittäinen merkintä:

```bash
ip neigh del 192.168.1.50 dev eth0
```

**Rajapintakohtainen flush** pakottaa uudet ARP-kyselyt ilman koko järjestelmän tyhjennystä.

## Käytännössä

`ip neigh flush all` tyhjentää kaikki naapurit kaikilla rajapinnoilla — voi aiheuttaa lyhyen katkon kaikille yhteyksille. Migraation jälkeen tyhjennä cache sekä VM:llä että gatewaylla jos ongelma jatkuu. GARP (gratuitous ARP) migraatiosta auttaa joissain hypervisor-ympäristöissä automaattisesti.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html)

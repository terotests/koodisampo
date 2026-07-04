# Tuotantoverkko — checksum offload aiheuttaa corrupt-paketteja virtuaalisessa NIC:ssä. Mitä työkalu?

## Tilanne

VM siirretty uuteen hypervisoriin. TCP-yhteydet näyttävät toimivan, mutta satunnaisesti tiedostosiirrot korruptoituvat tai TLS-yhteydet katkeavat. Epäilet NIC-offload-ominaisuuksien yhteensopimattomuutta virtuaalisessa verkossa.

```bash
dmesg | grep -i checksum
# mahdollisia virheitä tx/rx
```

## Ratkaisu

Tarkista offload-tila:

```bash
ethtool -k eth0
```

Poista checksum offload testiksi:

```bash
sudo ethtool -K eth0 tx off rx off
```

**ethtool -K eth0 tx off rx off — checksum offload kytketään pois.**

Jos ongelma katoaa, syy on offload-ketjussa (hypervisor, driver, MTU).

## Käytännössä

Offloadin poisto laskee suorituskykyä — käytä vain diagnostiikkaan tai väliaikaisena korjauksena. Pysyvä fix: päivitä virtio/vmxnet3-driver, tarkista MTU (especially 9000 vs 1500), hypervisorin offload-asetukset. Dokumentoi `ethtool -k` ennen ja jälkeen muutoksen. Muut offloadit (TSO, GSO) voi kytkeä pois samalla tavalla tarvittaessa.

[Lue lisää](https://man7.org/linux/man-pages/man8/ethtool.8.html)

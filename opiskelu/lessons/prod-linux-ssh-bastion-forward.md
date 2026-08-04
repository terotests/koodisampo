# Pääsy tuotantoon vain bastionin kautta ja tarvitset paikallisen portin 5432 tietokantaan. SSH-komennot?

## Tilanne

Suora SSH tietokantaan / app-hostiin on estetty. Pääsy vain bastionin kautta. Haluat paikallisen `localhost:5432` → sisäverkon `db.internal:5432` tunnelin admin-työkalulle.

## Ratkaisu

ProxyJump + LocalForward:

```bash
ssh -J bastion.example.com -L 5432:db.internal:5432 prod.example.com
```

Tai `~/.ssh/config`:

```
Host prod
  HostName prod.example.com
  ProxyJump bastion.example.com
  LocalForward 5432 db.internal:5432
```

`-J` hyppää bastionin kautta; `-L` tunneloi paikallisen portin kohteeseen *remote-hostin näkökulmasta* (tai bastionin, riippuen hopista).

## Käytännössä

- Agent forwarding (`-A`) on eri käyttötapaus — älä sekoita LocalForwardiin; rajoita agenttia tuotannossa.
- Sulje tunneli kun et tarvitse; älä jätä avoimia porteja.
- Vaihtoehto: VPN / wireguard / cloud SSM — SSH-tunneli on nopea admin-työkalu.

[Lue lisää](https://man.openbsd.org/ssh.1)

# Minimoit konttioikeudet — tarvitset vain verkon, ei kernel-muutoksia. Mitä compose-asetusta käytät?

## Tilanne
Kontti tarvitsee vain HTTP-palvelun — ei kernel-moduuleja, ei raw sockets. Oletus antaa laajan capability-joukon.

## Ratkaisu
**cap_drop: ALL + cap_add vain tarvittavat.**

```yaml
cap_drop:
  - ALL
cap_add:
  - NET_BIND_SERVICE  # vain jos portti < 1024
security_opt:
  - no-new-privileges:true
```

Drop all capabilities, add minimal — Docker security.

## Käytännössä
Testaa jokainen cap_drop muutos. `no-new-privileges` estää SUID-escalationin.

[Lue lisää](https://docs.docker.com/engine/containers/run/#runtime-privilege-and-linux-capabilities)

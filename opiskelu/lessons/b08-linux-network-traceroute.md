# API-viive — epäilet reitityspolkua ulkoiseen palveluun. Perustyökalu polun selvittämiseen?

## Tilanne

Integraatio ulkoiseen SaaS-API:in on hidastunut. Latency on kasvanut 50 ms → 800 ms. Epäilet reitityspolun muutosta tai ylimääräisiä hoppeja palomuurin tai carrierin kautta.

```bash
curl -w '%{time_connect}\n' -o /dev/null -s https://api.saas.com/
# 0.850
```

## Ratkaisu

```bash
traceroute api.saas.com
# tai ilman root-oikeuksia:
tracepath api.saas.com
```

Näyttää hopit ja viiveet:

```
 1  gateway (192.168.1.1)  1.2 ms
 2  isp-router (10.0.0.1)  5.3 ms
 3  * * *
 4  api-edge (203.0.113.5) 45.2 ms
```

**traceroute tai tracepath kohde — näyttää reitityksen hopit.**

IPv6:lle: `traceroute -6` tai `tracepath -6`.

## Käytännössä

Monet palvelimet eivät vastaa ICMP:hen — `* * *` ei aina tarkoita ongelmaa. Vertaa tulosta tunnetusta hyvästä baselinesta. MTR (`mtr`) yhdistää pingin ja tracerouten jatkuvaan seurantaan. Tuotantoincidentissä dokumentoi traceroute molempiin suuntiin ja aikaleima — ISP-ticket vaatii usein nämä tiedot.

[Lue lisää](https://man7.org/linux/man-pages/man8/traceroute.8.html)

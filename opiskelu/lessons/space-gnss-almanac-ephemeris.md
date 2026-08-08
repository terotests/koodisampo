# Mikä ero on almanakalla ja efemeridillä GNSS:ssä?

## Tilanne

Cold start kestää kauan, warm start vähemmän. Mikä data puuttuu?

## Ratkaisu

**Almanakka** (~kB, voimassa viikkoja) antaa karkean paikan kaikille satelliiteille → vastaanotin tietää mitä etsiä. **Efemeridi** (per satelliitti, voimassa ~2–4 h GPS:ssä) antaa tarkan radan ja kellon navigointiratkaisuun. Ilman efemeridiä et saa luotettavaa fixiä.

## Käytännössä

A-GNSS (assisted) tuo efemeridin verkosta → TTFF lyhenee. Tallenna almanakka laitteeseen warm/hot startia varten.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/GPS_Navigation_Message)

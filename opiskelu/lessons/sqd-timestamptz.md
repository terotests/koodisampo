# Palvelimet ovat eri aikavyöhykkeillä, ja tapahtumien järjestys sekoaa raporteissa. Aikasarake on `timestamp` (without time zone). Mikä on suositus?

## Tilanne

Tapahtumia kirjoittavat palvelimet Helsingissä, Frankfurtissa ja Virginiassa. Sarake on `timestamp without time zone`, ja jokainen palvelin kirjoittaa oman paikallisen aikansa. Raportissa tapahtumat ovat väärässä järjestyksessä, ja kesäajan vaihde tuottaa tunnin aukkoja ja päällekkäisyyksiä.

## Ratkaisu

Käytä tyyppiä **`timestamptz`** (`timestamp with time zone`):

```sql
ALTER TABLE events
  ALTER COLUMN occurred_at TYPE timestamptz
  USING occurred_at AT TIME ZONE 'Europe/Helsinki';  -- vanhojen arvojen tulkinta
```

Sovellus lähettää ajat vyöhykkeen kanssa (ISO 8601, esim. `2024-03-10T12:00:00+02:00`) tai UTC:nä.

## Taustaa

Nimestään huolimatta `timestamptz` ei tallenna vyöhykettä: se muuntaa syötteen UTC:ksi ja tallentaa **yksiselitteisen hetken**. Luettaessa arvo näytetään istunnon `TimeZone`-asetuksen mukaan. Vertailu, järjestys ja aikavälit toimivat siksi oikein riippumatta siitä, missä arvo kirjoitettiin.

`timestamp` ilman vyöhykettä on pelkkä "seinäkellon aika" ilman tietoa siitä, minkä vyöhykkeen kellosta on kyse. Se sopii lähinnä tuleviin paikallisiin tapahtumiin (esim. "kokous klo 9 Helsingin aikaa"), joissa vyöhyke tallennetaan erikseen.

[Lue lisää](https://wiki.postgresql.org/wiki/Don%27t_Do_This#Don.27t_use_timestamp_.28without_time_zone.29)

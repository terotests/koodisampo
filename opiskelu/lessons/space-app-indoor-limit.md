# Miksi tavallinen GNSS toimii heikosti syvällä sisätiloissa?

## Tilanne

Sovellus lupaa 'GPS-navigoinnin kauppakeskuksessa'. Mitä epäilet?

## Ratkaisu

GNSS L1-signaali on heikko (~−130 dBm) jo ulkona. Seinät ja metallirakenteet **vaimentavat** sen käyttökelvottomaksi. Markkinointi tarkoittaa usein hybridiä: Wi-Fi RTT, bluetooth beacon, UWB, magneettikartta, inertial — ei puhdasta satelliittifixää.

## Käytännössä

UX: kerro käyttäjälle kun GNSS-fix puuttuu. Älä näytä viimeistä ulkopaikkaa sisätilassa ilman varoitusta.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Indoor_Positioning)

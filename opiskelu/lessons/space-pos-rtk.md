# Mikä on RTK-paikannuksen ydinidea?

## Tilanne

Drone-kartoitus vaatii senttitasoa. Myyjä tarjoaa 'RTK-GNSS'. Mitä ketjuun tarvitaan?

## Ratkaisu

**RTK** käyttää tukiasemaa (tai verkko-RTK/VRS) jonka paikka tunnetaan. Liikkuja vastaanottaa **RTCM**-korjauksia ja ratkaisee kantoaallon **ambiguityt**. Fixed-tilassa suhteellinen tarkkuus on tyypillisesti 1–2 cm vaakaan lyhyillä baselineilla.

## Käytännössä

Tarkista NTRIP-yhteys, baseline-pituus, fixed/float-tila ja antennin kalibrointi. Ilman fixed-ambiguityä olet 'float'-tarkkuudessa (dm).


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Real_Time_Kinematics)

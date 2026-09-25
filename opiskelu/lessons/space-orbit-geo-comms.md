# Miksi TV-satelliitit sijoitetaan GEO-radalle, mutta globaalit GNSS-konstellaatiot perustuvat pääosin MEO-ratoihin?

## Tilanne

Asiakas kysyy, miksei GPS-satelliittia voi parkkeerata taivaalle kuin Astra-TV-satelliittia. Haluat selittää GEO:n ja GNSS:n eron ilman jargonivuorta.

## Ratkaisu

**GEO** (geostationaarinen rata) kiertää päiväntasaajan yllä synkronissa maan pyörimisen kanssa, joten satelliitti näyttää paikallaan olevalta. Se sopii viestintään ja säähän yhdelle mantereelle. **GNSS** tarvitsee kuitenkin *useita* satelliitteja eri atsimuutti- ja elevaatiokulmissa trilateraatiota varten — yksi GEO-piste ei anna 3D-geometriaa. Kaikki GEO-satelliitit ovat lisäksi päiväntasaajan yllä, joten ne näkyvät korkeilla leveysasteilla matalalla ja samasta suunnasta. Siksi globaali konstellaatio hajautetaan useille kallistetuille MEO-ratatasoille.

## Käytännössä

Muista: GEO ei ole GNSS:ltä kielletty. SBAS-täydennykset (EGNOS) lähettävät korjausdataa GEO-satelliiteista, ja BeiDou käyttää MEO:n lisäksi GEO- ja IGSO-satelliitteja alueelliseen peittoon Aasiassa. Globaalin peiton runko on kuitenkin MEO:ssa.


[Lue lisää](https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits)

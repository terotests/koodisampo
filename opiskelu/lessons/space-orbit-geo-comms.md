# Miksi TV- ja sääsatelliitit usein sijoitetaan GEO-radalle, mutta GNSS ei?

## Tilanne

Asiakas kysyy, miksei GPS-satelliittia voi parkkeerata taivaalle kuin Astra-TV-satelliittia. Haluat selittää GEO:n ja GNSS:n eron ilman jargonivuorta.

## Ratkaisu

**GEO** (geostationaarinen rata) kiertää päiväntasaajan yllä synkronissa maan pyörimisen kanssa, joten satelliitti näyttää paikallaan olevalta. Se sopii viestintään ja säähän yhdelle mantereelle. **GNSS** tarvitsee kuitenkin *useita* satelliitteja eri atsimuutti- ja elevaatiokulmissa trilateraatiota varten — yksi GEO-piste ei anna 3D-geometriaa. Siksi konstellaatio hajautetaan MEO:lle.

## Käytännössä

Muista: GEO ≠ GNSS. SBAS-täydennykset (EGNOS) voivat käyttää GEO-satelliitteja korjausdatan lähetykseen, mutta itse paikannussatelliitit ovat MEO:ssa.


[Lue lisää](https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits)

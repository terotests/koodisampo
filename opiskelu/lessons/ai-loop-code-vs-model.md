# Mikä kannattaa toteuttaa harnessissa koodina eikä jättää mallin ohjeiden varaan?

## Ratkaisu

Jako: **malli** tekee harkintaa vaativat päätökset, **harness** valvoo invariantteja. Jos sääntö 'älä koskaan aja `git push --force`' on vain promptissa, se pitää useimmiten, mutta ei aina. Lupatarkistus koodissa pitää joka kerta.

## Käytännössä

Kysy jokaisen säännön kohdalla: mitä tapahtuu, jos malli rikkoo tämän kerran sadasta? Jos vastaus on 'jotain pahaa', siirrä sääntö koodiin.


[Lue lisää](https://www.anthropic.com/engineering/building-effective-agents)

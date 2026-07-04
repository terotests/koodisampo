# Tarina riippuu toisen tiimin API:sta jota ei ole vielä olemassa. DoR-tilanne?

## Tilanne

Refinementissa tiimi käsittelee tarinaa "Näytä reaaliaikainen toimitusstatus asiakasportaalissa". Tarina vaatii toisen tiimin uuden API:n, jota ei ole vielä toteutettu eikä edes suunniteltu loppuun. Kehittäjä sanoo: "Voimme aloittaa frontendin ja integroimme myöhemmin."

Product Owner haluaa tarinan seuraavaan sprinttiin, koska asiakas on luvannut ominaisuuden. Sprint planningissa riippuvuus jää mainitsematta — tai se merkitään "to-do: odota API".

Sprintin ensimmäisellä viikolla työ pysähtyy: API:a ei ole, mockia ei ole sovittu, ja tiimi odottaa.

## Ratkaisu

**Ei Ready — riippuvuus ratkaistava tai mockattava ennen sprint commitmentia.**

Definition of Ready sisältää riippuvuuksien tunnistamisen. Jos tarina riippuu ulkoisesta API:sta, jota ei ole saatavilla, tarina ei ole valmis sprinttiin ennen kuin riippuvuus on ratkaistu — esimerkiksi API on olemassa, sopimus ja aikataulu on sovittu toisen tiimin kanssa, tai mock/stub on käytössä kehityksen ajan.

DoR sisältää riippuvuudet — ilman niitä tarina ei ole valmis.

## Käytännössä

Kirjaa riippuvuudet näkyvästi tarinan yhteyteen backlogissa. Sovi toisen tiimin kanssa API-sopimus (contract) ennen sprinttiin ottoa. Jos API viivästyy, mock mahdollistaa etenemisen — mutta mock on DoR:n osa, ei sprintin sisällä keksittävä ratkaisu.

[Lue lisää](https://scrumguides.org/scrum-guide.html#product-backlog)

# Agentilla on send_invoice-työkalu. Mikä on tärkein suunnitteluperiaate?

## Ratkaisu

Luokittele työkalut: lukevat (turvallisia), paikalliset kirjoittavat (peruutettavia) ja ulkoiset sivuvaikutukset (sähköposti, maksut, julkaisut). Viimeiset vaativat vahvistuksen. Verkkovirhe voi johtaa uudelleenyritykseen, joten sama pyyntö ei saa laskuttaa kahdesti.

## Käytännössä

Näytä hyväksyntädialogissa tarkat parametrit (vastaanottaja, summa), ei vain työkalun nimeä.


[Lue lisää](https://www.anthropic.com/engineering/building-effective-agents)

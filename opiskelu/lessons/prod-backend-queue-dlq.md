# Taustajobi epäonnistuu aina samalla viestillä ja jono jumittuu. Mitä teet?

## Tilanne

Worker käsittelee kuvatiedostoja jonosta. Yksi vioittunut tiedosto aiheuttaa aina poikkeuksen. Viesti palaa jonoon heti uudelleen ja worker käsittelee samaa viestiä loputtomasti — **poison message**. Oikeat työt jäävät odottamaan, DLQ kasvaa tyhjänä koska sitä ei ole, ja hälytyksiä ei tule.

Taustatyöt ovat backendin arkipäivää: webhook-käsittely, sähköpostit, raportit, thumbnail-generointi. Ilman hallittua retry-politiikkaa yksi huono viesti voi pysäyttää koko putken.

## Ratkaisu

**Rajaa retryt, käytä backoffia ja siirrä pysyvästi epäonnistuva viesti dead-letter queueen.**

Taustatöissä pitää olla hallittu retry-politiikka. Hyvä käytäntö:

- rajaa retryjen määrä
- käytä backoffia
- siirrä pysyvästi epäonnistuva viesti dead-letter queueen
- logita `job_id`, `trace_id` ja virheen syy
- tee käsittelystä idempotentti, koska sama job voi tulla uudelleen
- lisää hälytys, jos DLQ kasvaa

Muuten yksi poison message voi kuluttaa workerit ja peittää alleen oikeat työt. Pilvipalvelun managed queue ei poista idempotencyn tarvetta.

## Käytännössä

Aseta esim. max 3–5 retryä exponential backoffilla. DLQ:sta voi myöhemmin analysoida viestin ja korjata datan. Workerin pitää erottaa tilapäinen virhe (verkko) pysyvästä (korruptti tiedosto). SQS, RabbitMQ ja Kafka tukevat DLQ-mallia — periaate on sama kaikissa.

[Lue lisää](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)

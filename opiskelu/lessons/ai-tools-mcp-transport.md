# Mitkä ovat MCP:n standardit kuljetuskerrokset (transports)?

## Ratkaisu

**stdio**: palvelin käynnistetään aliprosessina ja viestit kulkevat stdin/stdout-virroissa. Yksinkertainen ja nopea paikallisesti. **Streamable HTTP**: palvelin on HTTP-endpoint, joka voi vastata SSE-striimillä. Sopii etäpalveluihin ja monelle käyttäjälle, ja siihen liittyy OAuth-pohjainen valtuutus.

## Käytännössä

stdio-palvelimessa älä kirjoita lokeja stdoutiin, koska se rikkoo protokollan. Käytä stderr:iä.


[Lue lisää](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)

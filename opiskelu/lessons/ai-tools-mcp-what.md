# Mikä on MCP (Model Context Protocol)?

## Ratkaisu

MCP (Anthropic julkaisi marraskuussa 2024) on avoin standardi: kerran tehty MCP-palvelin (esim. GitHub, Postgres, Slack) toimii kaikissa MCP:tä tukevissa sovelluksissa. Viestit ovat JSON-RPC 2.0:aa. Arkkitehtuuri: host (sovellus) → client (yksi per yhteys) → server.

## Käytännössä

Ennen omaa integraatiota katso, onko valmis MCP-palvelin olemassa. Tarkista palvelimen alkuperä ja oikeudet ennen käyttöönottoa.


[Lue lisää](https://modelcontextprotocol.io/docs/learn/architecture)

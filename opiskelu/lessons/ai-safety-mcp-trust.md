# Tiimi haluaa asentaa netistä löytyneen MCP-palvelimen agentilleen. Mitä pitää huomioida?

## Ratkaisu

stdio-palvelin on paikallinen prosessi käyttäjän oikeuksin. Työkalukuvaukset ovat tekstiä, joka menee suoraan mallin kontekstiin, joten niihin voi piilottaa ohjeita. Palvelimen päivitys voi myös muuttaa käytöstä jälkikäteen.

## Käytännössä

Suosi virallisia palvelimia, lukitse versiot, anna kapeat tokenit ja aja tuntemattomat palvelimet kontissa.


[Lue lisää](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)

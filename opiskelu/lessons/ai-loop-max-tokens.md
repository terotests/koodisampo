# Vastaus katkesi stop_reason = max_tokens kesken työkalukutsun syötteen. Mitä harnessin pitää tehdä?

## Ratkaisu

`stop_reason` kertoo miksi malli lopetti: `end_turn`, `tool_use`, `max_tokens`, `stop_sequence`, `refusal` jne. Harnessin on käsiteltävä jokainen erikseen. `max_tokens` tarkoittaa, että tuotos loppui kesken.

## Käytännössä

Tee stop_reason-käsittelystä kattava switch. Loggaa tuntemattomat arvot, älä oleta että kaikki muu kuin tool_use on valmis vastaus.


[Lue lisää](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)

# Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network mode?

**Ratkaisu:** `network_mode: host` — kontti jakaa hostin verkkostackin, ei port-mappingia eikä bridge-NAT:ia.

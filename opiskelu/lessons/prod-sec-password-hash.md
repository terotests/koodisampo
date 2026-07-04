# Salasanat tallennetaan SHA-256-hasheina ilman suolaa. Mikä parempi ratkaisu?

**Ratkaisu:** hidas, suolattu password hash — **Argon2id**, **bcrypt** tai **scrypt**. SHA-256 on liian nopea brute forceen; suola estää rainbow-taulut.

Käytä valmista kirjastoa (`libsodium`, `bcrypt`), älä rullaa omaa.

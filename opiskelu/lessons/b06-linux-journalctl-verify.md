# Audit vaatii lokien eheyden tarkistuksen. Mitä journalctl tarjoaa?

**Ratkaisu:** `journalctl --verify` tarkistaa logien eheyden. Tuotannossa: **FSS** (Forward Secure Sealing) `journald.conf`:ssa (`Seal=yes`) — estää menneiden lokien hiljaisen muokkauksen.

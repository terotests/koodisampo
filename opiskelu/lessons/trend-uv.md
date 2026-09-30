# Mikä on uv Python-kehityksessä?

## Ratkaisu

`uv init`, `uv add requests`, `uv run main.py`: uv luo tarvittaessa ympäristön, ratkaisee riippuvuudet `uv.lock`-tiedostoon ja asentaa ne välimuistista, usein kertaluokkia nopeammin kuin pip. `uvx` ajaa työkaluja kertakäyttöisesti (vrt. npx).

## Käytännössä

CI:ssä `uv sync --locked` varmistaa, että asennus vastaa lukkotiedostoa.


[Lue lisää](https://docs.astral.sh/uv/)

# Mitä WebAssemblyn Component Model ja WIT tuovat pelkkiin Wasm-moduuleihin verrattuna?

## Ratkaisu

WASI 0.2 (2024) rakentuu Component Modelin päälle. WIT (Wasm Interface Type) on IDL, jolla määritellään rajapinnat (esim. `wasi:http/incoming-handler`). Rust-, Go- tai Python-komponentti voi toteuttaa saman rajapinnan, ja ajoympäristö (Wasmtime) yhdistää ne. Käyttökohteita ovat palvelinpuolen pluginit ja edge-funktiot.

## Käytännössä

Käytä valmiita työkaluja (cargo component, wit-bindgen), sillä ABI-tason yksityiskohtia ei kannata kirjoittaa käsin.


[Lue lisää](https://component-model.bytecodealliance.org/)

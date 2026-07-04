# Callback rekisteröidään `std::bind(&Service::handle, this, std::placeholders::_1)`. Mitä cpp-best-practices suosittelee?

## Tilanne

```cpp
registry.register(std::bind(&Service::handle, this, _1));
```

`bind` + placeholders — vaikea lukea, virhealttiin overload-resoluution kanssa. Debuggaus vaikeaa.

## Ratkaisu

**Lambda**:

```cpp
registry.register([this](auto arg) { handle(arg); });
```

Selkeä capture, sama suorituskyky tai parempi. C++14 generic lambda joustavuuteen.

## Käytännössä

CppBestPractices: prefer lambda over bind. `bind` legacy-yhteensopivuuteen. Review: "Korvaa lambda."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/08-Considering_Performance.md)

# Miksi `noexcept` voi auttaa move-operaatioissa?

## Tilanne

Luokka `Blob` moveaa bufferin:

```cpp
class Blob {
public:
    Blob(Blob&& other) { /* voi heittää */ }
};

std::vector<Blob> blobs;
blobs.push_back(Blob{});  // reallokointi — kopioi eikä movea?
```

`std::vector` kasvaa reallokoidessa: jos move-operaattori **voi heittää**, vectorin täytyy taata strong exception guarantee — se **kopioi** elementit sen sijaan että siirtäisi. Profileri näyttää odottamattomia kopioita, vaikka move-operaattori on olemassa.

## Ratkaisu

Merkitse move **`noexcept`**, kun se ei heitä:

```cpp
class Blob {
public:
    Blob(Blob&& other) noexcept
        : data_(std::exchange(other.data_, nullptr)) {}

    Blob& operator=(Blob&& other) noexcept {
        if (this != &other) {
            delete data_;
            data_ = std::exchange(other.data_, nullptr);
        }
        return *this;
    }
};
```

`vector`, `swap` ja moni kontti valitsee move vs copy **`noexcept`-tiedon** perusteella (`std::move_if_noexcept`).

## Käytännössä

`noexcept` move on suorituskyky- ja turvallisuusvaatimus konttien kanssa. Jos move voi heittä (esim. allokaatio), jätä pois — vector kopioi turvallisesti. `noexcept`-specifier on osa API-sopimusta — älä valehtele.

[Lue lisää](https://en.cppreference.com/w/cpp/language/noexcept)

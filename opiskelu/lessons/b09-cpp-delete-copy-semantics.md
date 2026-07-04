# Luokka hallitsee yksilöllistä resurssia — kopio ei saa olla mahdollinen. Miten ilmaiset API:ssa?

## Tilanne

`FileHandle`, socket tai lisenssitoken edustaa resurssia, jota voi omistaa vain yksi olio kerrallaan. Jos kopiointi on mahdollista, kaksi kopiota yrittää sulkea saman käsittelijän — double-close, dangling handle tai turvallisuusaukko.

Kääntäjä ei estä kopiointia automaattisesti, vaikka destructor on määritelty. Oletusarvoiset copy-operaatiot tekevät member-wise kopion — osoitin tai fd kopioidaan, omistajuus ei siirry.

## Ratkaisu

Poista kopiointi tietoisesti `= delete`:

```cpp
class FileHandle {
public:
    explicit FileHandle(int fd) : fd_(fd) {}
    ~FileHandle() { if (fd_ >= 0) ::close(fd_); }

    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;

    FileHandle(FileHandle&& other) noexcept : fd_(std::exchange(other.fd_, -1)) {}
    FileHandle& operator=(FileHandle&& other) noexcept;

private:
    int fd_;
};
```

`delete` tekee virheestä **käännösaikaisen** — kutsuja ei voi vahingossa kopioida. Siirto (`move`) voi silti olla sallittu, jos omistajuus siirtyy selkeästi.

## Rule of Five

Kun määrittelet destructorin, päätä kaikki viisi operaatiota: copy ctor, copy assign, move ctor, move assign, destructor. Vaihtoehdot: kaikki `= default`, kaikki tarvittavat `= delete`, tai täysi custom-toteutus. Puoliksi määritelty luokka on yleinen bugilähde.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#c21)

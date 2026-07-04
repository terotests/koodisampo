# API ottaa raw pointer ja pituus — buffer overrun tuotannossa. Miten modernisoida turvallisesti?

**Ratkaisu:** korvaa `void foo(const char* buf, size_t len)` → `void foo(std::span<const std::byte>)` tai `std::span<const char>`.

Kutsuja ja funktio jakavat saman pituustiedon; rajat ovat tyypin osa.

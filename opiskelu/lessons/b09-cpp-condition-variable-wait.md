# Worker-säie odottaa queuea — spurious wakeup aiheuttaa tyhjän pop:in. Oikea wait-pattern?

## Tilanne

Tuottaja-kuluttaja-malli: worker odottaa työtä jonosta. Koodi tekee:

```cpp
std::unique_lock lock(mtx);
cv.wait(lock);
auto item = queue.pop();  // kaatuu jos jono tyhjä
```

`condition_variable::wait` voi herättää säikeen **ilman notifya** (spurious wakeup). Jos tarkistus puuttuu, tyhjä jono aiheuttaa kaatumisen tai UB:n.

## Ratkaisu

Käytä aina predikaattia — tarkista ehto uudelleen heräämisen jälkeen:

```cpp
std::unique_lock lock(mtx);
cv.wait(lock, [&] { return !queue.empty() || shutdown; });

if (shutdown && queue.empty()) return;
auto item = queue.pop();
```

Predikaatti vastaa while-silmukkaa: `while (!pred()) wait()`. C++ standard library hoitaa loopin puolestasi.

## Käytännössä

Ilmoita aina selkeä ehto: jono ei tyhjä, shutdown-flag, tai bufferissa tilaa. `notify_one()` tuottajalta kun ehto muuttuu. Älä odota ilman hallittua jaettua tilaa ja mutexia.

[Lue lisää](https://en.cppreference.com/w/cpp/thread/condition_variable/wait)

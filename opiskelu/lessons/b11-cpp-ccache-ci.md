# CI-build kestää 40 min vaikka vain yksi .cpp muuttui. Mitä cpp-best-practices suosittelee?

## Tilanne

CI kääntää kaiken puhtaalta pöydältä jokaisella pushilla. Yhden rivin muutos → 40 min odotus. Kehittäjät pushaavat harvemmin, isommat PR:t.

## Ratkaisu

**ccache** (GCC/Clang) tai **clcache** (MSVC):

```bash
cmake -B build -DCMAKE_CXX_COMPILER_LAUNCHER=ccache
export CCACHE_DIR=/ci/cache/ccache
```

Välimuistaa **objektitiedostot** — sama lähde + samat flagit = cache hit. Toinen build minuuteissa.

## Käytännössä

CI cache key: compiler version + flags + source hash. Yhdistä incremental link, unity build harkiten. ccache ei auta jos headerit muuttuvat usein — PCH/IWYU auttaa siinä.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/02-Use_the_Tools_Available.md)

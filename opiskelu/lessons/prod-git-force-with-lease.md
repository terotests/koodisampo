# Rebase tehtiin ja branch pitää puskea uudestaan. Miten vältät että ylikirjoitat kollegan commitit vahingossa?

**Ratkaisu:** `git push --force-with-lease` — puskee vain jos remote ei ole edennyt since viime fetch.

Turvallisempi kuin `--force`; hylkää push jos joku muu on puskenut väliin.

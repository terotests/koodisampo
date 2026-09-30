# Kolme rinnakkaista koodausagenttia muokkaa samaa repoa ja sotkee toistensa muutokset. Ratkaisu?

## Ratkaisu

Rinnakkaiset agentit tarvitsevat saman eristyksen kuin rinnakkaiset kehittäjät: oma työkopio, oma haara ja yhdistäminen PR:n tai mergen kautta. `git worktree add ../feat-x feat-x` luo kevyen lisätyökopion, joka jakaa .git-historian.

## Käytännössä

Jaa työ niin, että agentit koskevat eri tiedostoihin. Se vähentää merge-konflikteja enemmän kuin mikään työkalu.


[Lue lisää](https://git-scm.com/docs/git-worktree)

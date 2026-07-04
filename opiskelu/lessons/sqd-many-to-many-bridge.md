# Opiskelija–kurssi moni-moneen. Miten haet kurssin opiskelijat?

## Tilanne

Opetusjärjestelmässä opiskelija voi ilmoittautua usealle kurssille ja kurssilla voi olla useita opiskelijoita. Relaatiomalli:

```sql
-- students(id, name)
-- courses(id, title)
-- Ei suoraa FK:ta students → courses
```

Kehittäjä yrittää:

```sql
SELECT s.name, c.title
FROM students s
JOIN courses c ON c.id = s.course_id;  -- sarake ei ole olemassa!
```

Moni-moneen -suhde vaatii välittäjätaulun (bridge, junction, associate entity). Ilman sitä join on mahdoton tai väärä.

## Ratkaisu

**JOIN bridge-taulu `enrollment`: students → enrollment → courses**

```sql
SELECT s.name, c.title, e.enrolled_at
FROM courses c
JOIN enrollment e ON e.course_id = c.id
JOIN students s ON s.id = e.student_id
WHERE c.id = :course_id;
```

Bridge-taulu `enrollment` sisältää parit `(student_id, course_id)` ja usein metatiedot (ilmoittautumispäivä, arvosana). Se on normaali relaatiomalli moni-moneen -suhteille.

Bridge-taulu on normaali relaatiomalli — älä yritä "piilottaa" M:N-suhdetta duplikoimalla sarakkeita.

## Käytännössä

Lisää bridge-tauluun UNIQUE `(student_id, course_id)` estämään tuplailmoittautumiset. Indeksi `(course_id)` nopeuttaa "kurssin opiskelijat" -kyselyä; `(student_id)` "opiskelijan kurssit" -kyselyä.

ORM:ien `@ManyToMany` luo bridge-taulun automaattisesti — tarkista migraatiossa, että nimet ovat selkeät (`enrollment`, ei `students_courses` ilman dokumentaatiota).

Raporteissa COUNT: `SELECT count(*) FROM enrollment WHERE course_id = :id` — älä JOINaa tarpeettomasti vain laskemista varten.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)

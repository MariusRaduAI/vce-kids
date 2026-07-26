-- Resurse (template global) + Receptie/Security (ca proceduri, org_id null), din vk-team.com.

insert into public.resources (org_id, category, title, description, file_url) values
(null, 'altele', 'Template Pregatire SIM', 'Template-ul oficial pentru pregatirea Serviciului cu Impact Maxim', 'https://docs.google.com/spreadsheets/d/1qcVJ44Reyqg45C4ZGw8JL-YNXVngX8UhSeO1Z2a2SlU/edit?usp=sharing'),
(null, 'altele', 'Ghid Invatator', 'Ghid complet pentru invatatorii Vertical Kids', null),
(null, 'altele', 'Manual Voluntar', 'Tot ce trebuie sa stie un voluntar nou', null),
(null, 'altele', 'Materiale Curriculum', 'Materialele pentru curriculum-ul curent', null),
(null, 'altele', 'Formulare Utile', 'Formularele necesare pentru activitati', null);

insert into public.procedures (org_id, category, title, body) values
(null, 'receptie', 'Receptie — Ghid de Slujire', $$Scopul nostru este sa asiguram parintii ca fiecare copil este pretuit si in siguranta.

## Instructiuni pentru ziua de slujire
1. Sosire: 08:30 (SIM1) / 11:00 (SIM2) – rugaciune & organizare
2. Intrare in slujire: 09:10 (SIM1) / 11:55 (SIM2)
3. Tinuta decenta, ecuson vizibil, atitudine primitoare
4. Verificarea starii de sanatate (temperatura, alergii, boli contagioase)
5. Atribuirea codului de identificare copil: initiala prenumelui + initiala numelui + numar (ex: Avram Stoican → 01AS)
6. Informarea parintelui: aparitia codului pe ecran = parintele este chemat
7. Un slujitor conduce copilul la grupa, celalalt ramane la receptie
8. Completarea fiselor de prezenta + tabel online
9. Spalarea si distribuirea fructelor pe grupe
10. Predarea listelor de prezenta la final
11. Orice neregula este raportata coordonatorului
12. Asigurarea ca invatatorii stiu unde se transmit codurile (grup VK – Vertical Kids)
13. Copiii intarziati (dupa 10:00 / 12:30) sunt directionati spre sala de inchinare
14. Pentru copiii 6+ ani: telefoanele NU sunt permise in grupa
15. La final, ecusoanele si echipamentele se pun la loc

## Copiii NU sunt primiti daca prezinta
- Mucozitati colorate
- Tuse productiva
- Febra in ziua anterioara
- Apatie, frisoane, stare de moleseala
- Tratament cu antibiotice
- Enterocolita sau alte boli contagioase

In aceste situatii, parintele este rugat politicos sa plece cu copilul acasa.$$),

(null, 'receptie', 'Security Kids — Ghid de Slujire', $$**Locatie:** Receptia Kids (subsol) · **Rol:** asigurarea unui spatiu sigur si organizat pentru copii si parinti

## Program
- SIM 1: sosire 08:30, intrare in slujire 09:10
- SIM 2: sosire 11:00, intrare in slujire 11:40

Persoana ramane pe toata durata programului in zona Receptie Kids.

## Obiective principale
- Acces controlat
- Copiii nu parasesc zona fara adult
- Parintii nu raman in zona Kids dupa check-in
- Interventie politicos-ferma
- Raportare imediata coordonator

## Responsabilitati suplimentare
- Supravegherea fluxului intrare–iesire
- Observarea copiilor nelinistiti
- Suport echipa de receptie
- Confidentialitate totala

## Atitudine recomandata
Vigilent dar prietenos · Politicos dar ferm · Proactiv

## Protocol de urgenta
- Incendiu: evacuare pe traseele marcate
- Cutremur: copiii raman in clase, sub mobilier
- Evacuare: copiii merg cu liderii spre punctul de intalnire

## Security NU
- Disciplineaza copii
- Intra in clase
- Poarta discutii lungi cu parintii

## Security DA
- Previne acces neautorizat
- Supravegheaza fluxul
- Intervine ferm si politicos
- Raporteaza imediat incidente$$);

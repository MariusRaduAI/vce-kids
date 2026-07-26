-- Resurse (template global) + Recepție/Security (ca proceduri, org_id null), din vk-team.com.

insert into public.resources (org_id, category, title, description, file_url) values
(null, 'altele', 'Template Pregătire SIM', 'Template-ul oficial pentru pregătirea Serviciului cu Impact Maxim', 'https://docs.google.com/spreadsheets/d/1qcVJ44Reyqg45C4ZGw8JL-YNXVngX8UhSeO1Z2a2SlU/edit?usp=sharing'),
(null, 'altele', 'Ghid Învățător', 'Ghid complet pentru învățătorii Vertical Kids', null),
(null, 'altele', 'Manual Voluntar', 'Tot ce trebuie să știe un voluntar nou', null),
(null, 'altele', 'Materiale Curriculum', 'Materialele pentru curriculum-ul curent', null),
(null, 'altele', 'Formulare Utile', 'Formularele necesare pentru activități', null);

insert into public.procedures (org_id, category, title, body) values
(null, 'receptie', 'Recepție — Ghid de Slujire', $$Scopul nostru este să asigurăm părinții că fiecare copil este prețuit și în siguranță.

## Instrucțiuni pentru ziua de slujire
1. Sosire: 08:30 (SIM1) / 11:00 (SIM2) – rugăciune & organizare
2. Intrare în slujire: 09:10 (SIM1) / 11:55 (SIM2)
3. Ținută decentă, ecuson vizibil, atitudine primitoare
4. Verificarea stării de sănătate (temperatură, alergii, boli contagioase)
5. Atribuirea codului de identificare copil: inițiala prenumelui + inițiala numelui + număr (ex: Avram Stoican → 01AS)
6. Informarea părintelui: apariția codului pe ecran = părintele este chemat
7. Un slujitor conduce copilul la grupă, celălalt rămâne la recepție
8. Completarea fișelor de prezență + tabel online
9. Spălarea și distribuirea fructelor pe grupe
10. Predarea listelor de prezență la final
11. Orice neregulă este raportată coordonatorului
12. Asigurarea că învățătorii știu unde se transmit codurile (grup VK – Vertical Kids)
13. Copiii întârziați (după 10:00 / 12:30) sunt direcționați spre sala de închinare
14. Pentru copiii 6+ ani: telefoanele NU sunt permise în grupă
15. La final, ecusoanele și echipamentele se pun la loc

## Copiii NU sunt primiți dacă prezintă
- Mucozități colorate
- Tuse productivă
- Febră în ziua anterioară
- Apatie, frisoane, stare de moleșeală
- Tratament cu antibiotice
- Enterocolită sau alte boli contagioase

În aceste situații, părintele este rugat politicos să plece cu copilul acasă.$$),

(null, 'receptie', 'Security Kids — Ghid de Slujire', $$**Locație:** Recepția Kids (subsol) · **Rol:** asigurarea unui spațiu sigur și organizat pentru copii și părinți

## Program
- SIM 1: sosire 08:30, intrare în slujire 09:10
- SIM 2: sosire 11:00, intrare în slujire 11:40

Persoana rămâne pe toată durata programului în zona Recepție Kids.

## Obiective principale
- Acces controlat
- Copiii nu părăsesc zona fără adult
- Părinții nu rămân în zona Kids după check-in
- Intervenție politicos-fermă
- Raportare imediată coordonator

## Responsabilități suplimentare
- Supravegherea fluxului intrare–ieșire
- Observarea copiilor neliniștiți
- Suport echipa de recepție
- Confidențialitate totală

## Atitudine recomandată
Vigilent dar prietenos · Politicos dar ferm · Proactiv

## Protocol de urgență
- Incendiu: evacuare pe traseele marcate
- Cutremur: copiii rămân în clase, sub mobilier
- Evacuare: copiii merg cu liderii spre punctul de întâlnire

## Security NU
- Disciplinează copii
- Intră în clase
- Poartă discuții lungi cu părinții

## Security DA
- Previne acces neautorizat
- Supraveghează fluxul
- Intervine ferm și politicos
- Raportează imediat incidente$$);

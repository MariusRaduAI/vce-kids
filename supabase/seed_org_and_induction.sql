-- Organigrama reala VK Bucuresti + continut Induction, preluate din vk-team.com.

do $$
declare
  v_org_id uuid;
  v_edi uuid;
  v_coord uuid;
begin
  select id into v_org_id from public.organizations where slug = 'vk-bucuresti';

  -- Organigrama
  insert into public.org_chart_nodes (org_id, parent_id, title, sort_order)
  values (v_org_id, null, 'Edi Matei — Prezbiter responsabil Vertical Kids', 0)
  returning id into v_edi;

  insert into public.org_chart_nodes (org_id, parent_id, title, sort_order) values
    (v_org_id, v_edi, 'Marius Radu — Coordonator Kids', 1),
    (v_org_id, v_edi, 'Cristina Radu — Coordonator Kids', 2);

  insert into public.org_chart_nodes (org_id, parent_id, title, sort_order) values
    (v_org_id, v_edi, 'Rebeca Toma — Responsabil Curriculum & Pedagogie', 3),
    (v_org_id, v_edi, 'Claudia Seboiu — Responsabil Induction', 4),
    (v_org_id, v_edi, 'Ana Dumitrascu — Responsabil Inchinare Copii', 5),
    (v_org_id, v_edi, 'Ana Neagoe — Responsabil Materiale & Consumabile', 6),
    (v_org_id, v_edi, 'Paula Damian — Responsabil Evenimente Kids', 7),
    (v_org_id, v_edi, 'Alice Ivan — Responsabil Receptie Copii', 8);

  insert into public.org_chart_nodes (org_id, parent_id, title, sort_order) values
    (v_org_id, v_edi, 'Responsabili Fructe & Gustari (echipa de suport)', 9),
    (v_org_id, v_edi, 'Responsabili Adaptare Copii Noi (echipa de suport)', 10),
    (v_org_id, v_edi, 'Responsabili Security (echipa de suport)', 11),
    (v_org_id, v_edi, 'Lideri de Program — SIM (echipa de suport)', 12);
end $$;

-- Induction — template global (org_id null)
insert into public.induction_steps (org_id, title, body, sort_order) values

(null, 'Viziunea lucrarii de copii', $$Glorificarea lui Dumnezeu prin implinirea Marii Trimiteri (Matei 28:18-20), care consta in facerea de ucenici.

Scopul nostru este sa le spunem copiilor Cuvantul lui Dumnezeu pe intelesul lor astfel incat:
- Sa-L PRIMEASCA pe Domnul Isus
- Sa CREASCA in credinta
- Sa TRAIASCA zilnic cu El
- Sa INVETE sa faca alti ucenici

**Cei 4 stalpi:**
- Autoritatea Scripturii — Proclamam fara retinere autoritatea Scripturii
- Inchinare — Adoram cu toata fiinta Numele lui Isus Christos
- Rugaciune — Credem cu tarie in puterea rugaciunii
- Evanghelizare — Marturisim cu indrazneala Evanghelia lui Christos

Lucrarea cu copiii NU este o sub-lucrare. Este aceeasi lucrare! (Efeseni 4:4-6)
Lucrarea cu copiii nu inseamna supravegherea copiilor, ci facerea de ucenici. (Proverbe 22:6)

**Nu facem babysitting, ci prezentam copiilor Evanghelia!** Un ucenic e un credincios care: se inchina lui Christos, umbla cu Christos, lucreaza pentru Christos.$$, 1),

(null, 'Rolurile in echipa', $$**Invatator / Coordonator** — pregateste lectia, se asigura ca toti responsabilii stiu ce au de facut si coordoneaza SIM-ul.

**Asistent** — pregateste unul dintre momentele lectiei, ajuta la buna desfasurare a programului si asista invatatorul.
Responsabilitati: citirea textului biblic + memorarea versetului + studierea lectiei; pregatirea si desfasurarea sarcinilor alocate (predare verset, joc, lectie, rugaciune, craft); sprijinirea echipei pentru a mentine atentia copiilor; insotirea copiilor la toaleta (doar fete/femei); pregatirea materialelor; preluarea listei de prezenta.

**Voluntar** — se asigura ca sala e pregatita, materialele sunt la locul lor si atentia e indreptata spre cel care preda.
Responsabilitati: citirea textului biblic + memorarea versetului; sprijinirea echipei; insotirea la toaleta (doar fete/femei); pregatirea materialelor (spalat fructe, aranjat scaune, materiale craft).

**Reguli importante:**
- Grupa Baby: doar fetele schimba bebelusii (exceptie: tatal copilului)
- Grupa 2-3 ani: doar fetele merg la baie cu copiii
- Grupa 4-6, 6-7+ ani: pot fi insotiti de oricine

**Procedura de inlocuire:** daca nu poti ajunge, cauta inlocuitor pe grupul de WhatsApp Vertical Kids. Cauta sa faci o rocada cu cineva din aceeasi pozitie in saptamanile urmatoare — insista pana gasesti pe cineva.$$, 2),

(null, 'Programul SIM — Serviciu cu Impact Maxim', $$## Serviciul 1
08:45–09:00 Pregatiri · 09:00–09:20 Intalnire echipa · 09:30–10:00 Conectare · 10:00–10:15 Inchinare · 10:15–10:30 Lectie · 10:30–10:45 Verset · 10:45–11:00 Gustare (paralel cu Grup mic / Craft-Jocuri) · 11:00–11:30 Closing & Feedback parinti · 11:30–11:40 Pauza de masa

## Serviciul 2
11:40–12:05 Pregatiri · 12:05–12:15 Conectare · 12:15–12:30 Inchinare · 12:30–12:45 Lectie · 12:45–13:00 Verset · 13:00–13:15 Gustare · 13:15–13:30 Grup mic / Craft-Jocuri (paralel) · 13:30–14:00 Closing & Feedback · 14:00–14:10 Curatenie sala

## Lucruri esentiale
- Niciodata nu da skip rugaciunii pentru lucrarea de copii
- Nu uita ca cei mici sunt nemantuiti
- Copiii pot trece prin momente grele acasa — fii tu o incurajare pentru ei
- Arata-L pe Cristos prin tine
- Fa aceasta slujire cu bucurie
- Investeste in copii si ai rabdare!$$, 3),

(null, 'Traseu de slujire si cum te implici mai mult', $$## Roluri si directii de implicare
1. **Voluntar** — ofera sprijin echipei si copiilor
2. **Asistent** — coordoneaza activitatile secundare: craft, verset, jocuri
3. **Invatator** — pregateste si preda lectia, coordoneaza echipa
4. **Lider SIM** — coordoneaza grupele, ofera suport tuturor echipelor

## Echipe de suport
- Echipa de adaptare — integrarea copiilor noi sau cu nevoi speciale
- Materiale & consumabile — pregatire si organizare materiale
- Evenimente — sustinerea activitatilor speciale
- Fructe & gustari — organizare si grija practica pentru copii
- Echipa tehnica — amenajarea salilor, achizitii de mobilier si montaj

**Caracterul si inima de slujitor primeaza. Competentele se invata — noi oferim tot suportul necesar.**

## Cum functioneaza pasul urmator
1. Iti exprimi dorinta — spui clar in ce directie simti ca vrei sa cresti si de ce
2. Discutie cu coordonatorii Vertical Kids — nu e interviu, ci un dialog despre motivatie, potrivire si asteptari
3. Confirmare si pasii urmatori — urmeaza acordul prezbiterului responsabil; daca e momentul potrivit, intri in perioada de proba
4. Perioada de echipare & proba — acces la resurse interne si la platforma, plus perioada de proba in rol
5. Discutie de evaluare — analizam impreuna ce a functionat si daca rolul e potrivit
6. Confirmarea rolului — asumat oficial, cu responsabilitati clare si suport continuu

Nu este o aplicare. Este inceputul unei conversatii.$$, 4);

-- Organigramă reală VK București + conținut Induction, preluate din vk-team.com.

do $$
declare
  v_org_id uuid;
  v_edi uuid;
  v_coord uuid;
begin
  select id into v_org_id from public.organizations where slug = 'vk-bucuresti';

  -- Organigramă
  insert into public.org_chart_nodes (org_id, parent_id, title, sort_order)
  values (v_org_id, null, 'Edi Matei — Prezbiter responsabil Vertical Kids', 0)
  returning id into v_edi;

  insert into public.org_chart_nodes (org_id, parent_id, title, sort_order) values
    (v_org_id, v_edi, 'Marius Radu — Coordonator Kids', 1),
    (v_org_id, v_edi, 'Cristina Radu — Coordonator Kids', 2);

  insert into public.org_chart_nodes (org_id, parent_id, title, sort_order) values
    (v_org_id, v_edi, 'Rebeca Toma — Responsabil Curriculum & Pedagogie', 3),
    (v_org_id, v_edi, 'Claudia Seboiu — Responsabil Induction', 4),
    (v_org_id, v_edi, 'Ana Dumitrașcu — Responsabil Închinare Copii', 5),
    (v_org_id, v_edi, 'Ana Neagoe — Responsabil Materiale & Consumabile', 6),
    (v_org_id, v_edi, 'Paula Damian — Responsabil Evenimente Kids', 7),
    (v_org_id, v_edi, 'Alice Ivan — Responsabil Recepție Copii', 8);

  insert into public.org_chart_nodes (org_id, parent_id, title, sort_order) values
    (v_org_id, v_edi, 'Responsabili Fructe & Gustări (echipă de suport)', 9),
    (v_org_id, v_edi, 'Responsabili Adaptare Copii Noi (echipă de suport)', 10),
    (v_org_id, v_edi, 'Responsabili Security (echipă de suport)', 11),
    (v_org_id, v_edi, 'Lideri de Program — SIM (echipă de suport)', 12);
end $$;

-- Induction — template global (org_id null)
insert into public.induction_steps (org_id, title, body, sort_order) values

(null, 'Viziunea lucrării de copii', $$Glorificarea lui Dumnezeu prin împlinirea Marii Trimiteri (Matei 28:18-20), care constă în facerea de ucenici.

Scopul nostru este să le spunem copiilor Cuvântul lui Dumnezeu pe înțelesul lor astfel încât:
- Să-L PRIMEASCĂ pe Domnul Isus
- Să CREASCĂ în credință
- Să TRĂIASCĂ zilnic cu El
- Să ÎNVEȚE să facă alți ucenici

**Cei 4 stâlpi:**
- Autoritatea Scripturii — Proclamăm fără reținere autoritatea Scripturii
- Închinare — Adorăm cu toată ființa Numele lui Isus Christos
- Rugăciune — Credem cu tărie în puterea rugăciunii
- Evanghelizare — Mărturisim cu îndrăzneală Evanghelia lui Christos

Lucrarea cu copiii NU este o sub-lucrare. Este aceeași lucrare! (Efeseni 4:4-6)
Lucrarea cu copiii nu înseamnă supravegherea copiilor, ci facerea de ucenici. (Proverbe 22:6)

**Nu facem babysitting, ci prezentăm copiilor Evanghelia!** Un ucenic e un credincios care: se închină lui Christos, umblă cu Christos, lucrează pentru Christos.$$, 1),

(null, 'Rolurile în echipă', $$**Învățător / Coordonator** — pregătește lecția, se asigură că toți responsabilii știu ce au de făcut și coordonează SIM-ul.

**Asistent** — pregătește unul dintre momentele lecției, ajută la buna desfășurare a programului și asistă învățătorul.
Responsabilități: citirea textului biblic + memorarea versetului + studierea lecției; pregătirea și desfășurarea sarcinilor alocate (predare verset, joc, lecție, rugăciune, craft); sprijinirea echipei pentru a menține atenția copiilor; însoțirea copiilor la toaletă (doar fete/femei); pregătirea materialelor; preluarea listei de prezență.

**Voluntar** — se asigură că sala e pregătită, materialele sunt la locul lor și atenția e îndreptată spre cel care predă.
Responsabilități: citirea textului biblic + memorarea versetului; sprijinirea echipei; însoțirea la toaletă (doar fete/femei); pregătirea materialelor (spălat fructe, aranjat scaune, materiale craft).

**Reguli importante:**
- Grupa Baby: doar fetele schimbă bebelușii (excepție: tatăl copilului)
- Grupa 2-3 ani: doar fetele merg la baie cu copiii
- Grupa 4-6, 6-7+ ani: pot fi însoțiți de oricine

**Procedura de înlocuire:** dacă nu poți ajunge, caută înlocuitor pe grupul de WhatsApp Vertical Kids. Caută să faci o rocadă cu cineva din aceeași poziție în săptămânile următoare — insistă până găsești pe cineva.$$, 2),

(null, 'Programul SIM — Serviciu cu Impact Maxim', $$## Serviciul 1
08:45–09:00 Pregătiri · 09:00–09:20 Întâlnire echipă · 09:30–10:00 Conectare · 10:00–10:15 Închinare · 10:15–10:30 Lecție · 10:30–10:45 Verset · 10:45–11:00 Gustare (paralel cu Grup mic / Craft-Jocuri) · 11:00–11:30 Closing & Feedback părinți · 11:30–11:40 Pauză de masă

## Serviciul 2
11:40–12:05 Pregătiri · 12:05–12:15 Conectare · 12:15–12:30 Închinare · 12:30–12:45 Lecție · 12:45–13:00 Verset · 13:00–13:15 Gustare · 13:15–13:30 Grup mic / Craft-Jocuri (paralel) · 13:30–14:00 Closing & Feedback · 14:00–14:10 Curățenie sală

## Lucruri esențiale
- Niciodată nu da skip rugăciunii pentru lucrarea de copii
- Nu uita că cei mici sunt nemântuiți
- Copiii pot trece prin momente grele acasă — fii tu o încurajare pentru ei
- Arată-L pe Cristos prin tine
- Fă această slujire cu bucurie
- Investește în copii și ai răbdare!$$, 3),

(null, 'Traseu de slujire și cum te implici mai mult', $$## Roluri și direcții de implicare
1. **Voluntar** — oferă sprijin echipei și copiilor
2. **Asistent** — coordonează activitățile secundare: craft, verset, jocuri
3. **Învățător** — pregătește și predă lecția, coordonează echipa
4. **Lider SIM** — coordonează grupele, oferă suport tuturor echipelor

## Echipe de suport
- Echipa de adaptare — integrarea copiilor noi sau cu nevoi speciale
- Materiale & consumabile — pregătire și organizare materiale
- Evenimente — susținerea activităților speciale
- Fructe & gustări — organizare și grijă practică pentru copii
- Echipa tehnică — amenajarea sălilor, achiziții de mobilier și montaj

**Caracterul și inima de slujitor primează. Competențele se învață — noi oferim tot suportul necesar.**

## Cum funcționează pasul următor
1. Îți exprimi dorința — spui clar în ce direcție simți că vrei să crești și de ce
2. Discuție cu coordonatorii Vertical Kids — nu e interviu, ci un dialog despre motivație, potrivire și așteptări
3. Confirmare și pașii următori — urmează acordul prezbiterului responsabil; dacă e momentul potrivit, intri în perioada de probă
4. Perioadă de echipare & probă — acces la resurse interne și la platformă, plus perioadă de probă în rol
5. Discuție de evaluare — analizăm împreună ce a funcționat și dacă rolul e potrivit
6. Confirmarea rolului — asumat oficial, cu responsabilități clare și suport continuu

Nu este o aplicare. Este începutul unei conversații.$$, 4);

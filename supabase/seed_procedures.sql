-- Template global de Proceduri & Siguranță, preluat din vk-team.com (org_id NULL = vizibil tuturor bisericilor).

insert into public.procedures (org_id, category, title, body) values
(null, 'urgente', 'Contacte de urgență', $$**Urgențe: 112** — Poliție, Ambulanță, Pompieri

Coordonator Kids — completează cu numărul local
Prezbiter responsabil — completează cu numărul local$$),

(null, 'urgente', 'Accidente', $$1. Păstrează calmul și evaluează situația
2. Asigură-te că zona este sigură pentru toți
3. Pentru accidente minore: aplică primul ajutor de bază
4. Pentru accidente grave: sună imediat 112
5. Notifică coordonatorul și părinții
6. Completează raportul de incident$$),

(null, 'urgente', 'Prim-ajutor', $$1. Tăieturi mici: spală cu apă și săpun, aplică plasture
2. Lovituri/vânătăi: aplică gheață învelită în prosop
3. Sângerări nazale: aplică presiune, capul ușor în față
4. Pentru orice situație gravă: cheamă ajutor adult imediat
5. Nu administra medicamente fără acordul părinților
6. Kitul de prim-ajutor se află în dulapul marcat$$),

(null, 'urgente', 'Copil pierdut', $$1. Informează imediat coordonatorul
2. Verifică toate încăperile din zona Kids
3. Un adult rămâne cu ceilalți copii
4. Verifică toaletele și holurile
5. Dacă nu este găsit în 5 minute: alertă generală
6. Contactează părinții și securitatea clădirii$$),

(null, 'urgente', 'Incendiu', $$1. Activează alarma de incendiu dacă nu sună deja
2. NU încerca să stingi focul dacă este mare
3. Evacuează copiii calm și ordonat
4. Folosește ieșirea de urgență marcată
5. Adună copiii în punctul de întâlnire exterior
6. Numără copiii și verifică prezența
7. Așteaptă instrucțiuni de la pompieri$$),

(null, 'urgente', 'Cutremur', $$1. DROP: Lasă-te jos pe genunchi
2. COVER: Adăpostește-te sub o masă solidă
3. HOLD ON: Ține-te de masă până trece
4. Ferește-te de ferestre și obiecte care pot cădea
5. După cutremur: evacuare calmă dacă clădirea e afectată
6. Verifică copiii pentru răni
7. Așteaptă instrucțiuni oficiale$$),

(null, 'urgente', 'Evacuare', $$1. Rămâi calm și vorbește cu copiii liniștitor
2. Ia lista de prezență și kitul de urgență
3. Formați un șir ordonat (cei mici de mână)
4. Folosește ruta de evacuare afișată
5. Nu folosi liftul
6. Punct de întâlnire: zona exterioară marcată
7. Numără copiii și așteaptă părinții$$),

(null, 'siguranta', 'Reguli de siguranță', $$## Regula celor doi adulți
- Întotdeauna trebuie să fie cel puțin doi adulți prezenți la grupă
- Niciun adult nu poate fi singur cu un copil
- Unul dintre cei doi adulți trebuie să fie adult (peste 18 ani)

## Recepția copiilor
- Un adult stă la ușă și întâmpină prietenos fiecare familie
- Scrie numele copilului pe etichetă și lipește-o vizibil
- Notează informațiile speciale furnizate de părinți (alergii, nevoi)
- Nu permite intrarea părinților în grupă în timpul programului
- Dacă familia este nouă, fă o scurtă introducere

## Predarea copiilor
- Verifică cardul părintelui înainte de a preda copilul
- Dacă părintele vine fără card, e rugat să îl aducă
- Bifează numele copiilor care au fost predați
- Asigură-te că toate obiectele personale sunt date copilului
- Oferă pe scurt informații părinților despre cum a decurs timpul

## Schimbarea scutecelor
- Doar femeile schimbă scutecele (excepție: tatăl copilului)
- Folosește mănuși de unică folosință
- Pune hârtie de unică folosință sub copil
- Dezinfectează masa după fiecare schimbare
- Spală-te pe mâini cu săpun și dezinfectează-te

## Însoțire la toaletă
- Grupa Baby: doar femeile schimbă bebelușii
- Grupa 2-3 ani: doar femeile merg la baie cu copiii
- Grupa 4-6+ ani: pot fi însoțiți de oricine (nu au nevoie de asistență)
- Ușa toaletei rămâne închisă, dar niciodată blocată

## Gustare și alergii
- Verifică ÎNTOTDEAUNA alergiile înainte de a da ceva de mâncare
- La toate grupele se servesc doar fructe
- Dacă un părinte are pretenții speciale, trebuie să aducă gustarea personal
- Învățătorii nu consumă gustări în sală (doar apă)$$),

(null, 'siguranta', 'Inspectarea sălii înainte de program', $$- Podeaua și covoarele sunt aspirate și curate
- Prizele sunt acoperite cu capac de protecție
- Dulăpioarele sunt organizate și obiectele aranjate
- Jucăriile nu sunt rupte sau cu colțuri ascuțite
- Gustarea, apa și paharele sunt pregătite
- Materialele pentru activități sunt pregătite
- Există etichete și markere pentru ecusoane
- Echipamentele audio-video funcționează; muzica e pornită
- Toți învățătorii s-au spălat pe mâini$$),

(null, 'siguranta', 'Curățenia la final de program', $$1. Curăță toate mesele și suprafețele plane
2. Strânge ecusoanele adulților în cutie
3. Închide și încuie dulapurile
4. Pune jucăriile la loc și dezinfectează-le
5. Stinge echipamentele IT
6. Scoate gunoiul din clasă
7. Aruncă fișele și lucrările mai vechi de 2 săptămâni nerevendicate$$),

(null, 'siguranta', 'Ce NU trebuie să faci', $$- Nu lăsa niciodată un copil nesupravegheat
- Nu folosi telefon mobil în timpul slujirii
- Nu da skip rugăciunii înainte de program
- Nu fi plictisitor – e un păcat!
- Nu administra medicamente fără acordul părinților
- Nu permite părinților să intre în sală în timpul programului
- Nu consuma mâncare sau cafea în sala de grupă
- Nu lăsa copiii singuri cu un singur adult$$);

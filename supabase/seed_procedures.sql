-- Template global de Proceduri & Siguranta, preluat din vk-team.com (org_id NULL = vizibil tuturor bisericilor).

insert into public.procedures (org_id, category, title, body) values
(null, 'urgente', 'Contacte de urgenta', $$**Urgente: 112** — Politie, Ambulanta, Pompieri

Coordonator Kids — completeaza cu numarul local
Prezbiter responsabil — completeaza cu numarul local$$),

(null, 'urgente', 'Accidente', $$1. Pastreaza calmul si evalueaza situatia
2. Asigura-te ca zona este sigura pentru toti
3. Pentru accidente minore: aplica primul ajutor de baza
4. Pentru accidente grave: suna imediat 112
5. Notifica coordonatorul si parintii
6. Completeaza raportul de incident$$),

(null, 'urgente', 'Prim-ajutor', $$1. Taieturi mici: spala cu apa si sapun, aplica plasture
2. Lovituri/vanatai: aplica gheata invelita in prosop
3. Sangerari nazale: aplica presiune, capul usor in fata
4. Pentru orice situatie grava: cheama ajutor adult imediat
5. Nu administra medicamente fara acordul parintilor
6. Kitul de prim-ajutor se afla in dulapul marcat$$),

(null, 'urgente', 'Copil pierdut', $$1. Informeaza imediat coordonatorul
2. Verifica toate incaperile din zona Kids
3. Un adult ramane cu ceilalti copii
4. Verifica toaletele si holurile
5. Daca nu este gasit in 5 minute: alerta generala
6. Contacteaza parintii si securitatea cladirii$$),

(null, 'urgente', 'Incendiu', $$1. Activeaza alarma de incendiu daca nu suna deja
2. NU incerca sa stingi focul daca este mare
3. Evacueaza copiii calm si ordonat
4. Foloseste iesirea de urgenta marcata
5. Aduna copiii in punctul de intalnire exterior
6. Numara copiii si verifica prezenta
7. Asteapta instructiuni de la pompieri$$),

(null, 'urgente', 'Cutremur', $$1. DROP: Lasa-te jos pe genunchi
2. COVER: Adaposteste-te sub o masa solida
3. HOLD ON: Tine-te de masa pana trece
4. Fereste-te de ferestre si obiecte care pot cadea
5. Dupa cutremur: evacuare calma daca cladirea e afectata
6. Verifica copiii pentru rani
7. Asteapta instructiuni oficiale$$),

(null, 'urgente', 'Evacuare', $$1. Ramai calm si vorbeste cu copiii linistitor
2. Ia lista de prezenta si kitul de urgenta
3. Formati un sir ordonat (cei mici de mana)
4. Foloseste ruta de evacuare afisata
5. Nu folosi liftul
6. Punct de intalnire: zona exterioara marcata
7. Numara copiii si asteapta parintii$$),

(null, 'siguranta', 'Reguli de siguranta', $$## Regula celor doi adulti
- Intotdeauna trebuie sa fie cel putin doi adulti prezenti la grupa
- Niciun adult nu poate fi singur cu un copil
- Unul dintre cei doi adulti trebuie sa fie adult (peste 18 ani)

## Receptia copiilor
- Un adult sta la usa si intampina prietenos fiecare familie
- Scrie numele copilului pe eticheta si lipeste-o vizibil
- Noteaza informatiile speciale furnizate de parinti (alergii, nevoi)
- Nu permite intrarea parintilor in grupa in timpul programului
- Daca familia este noua, fa o scurta introducere

## Predarea copiilor
- Verifica cardul parintelui inainte de a preda copilul
- Daca parintele vine fara card, e rugat sa il aduca
- Bifeaza numele copiilor care au fost predati
- Asigura-te ca toate obiectele personale sunt date copilului
- Ofera pe scurt informatii parintilor despre cum a decurs timpul

## Schimbarea scutecelor
- Doar femeile schimba scutecele (exceptie: tatal copilului)
- Foloseste manusi de unica folosinta
- Pune hartie de unica folosinta sub copil
- Dezinfecteaza masa dupa fiecare schimbare
- Spala-te pe maini cu sapun si dezinfecteaza-te

## Insotire la toaleta
- Grupa Baby: doar femeile schimba bebelusii
- Grupa 2-3 ani: doar femeile merg la baie cu copiii
- Grupa 4-6+ ani: pot fi insotiti de oricine (nu au nevoie de asistenta)
- Usa toaletei ramane inchisa, dar niciodata blocata

## Gustare si alergii
- Verifica INTOTDEAUNA alergiile inainte de a da ceva de mancare
- La toate grupele se servesc doar fructe
- Daca un parinte are pretentii speciale, trebuie sa aduca gustarea personal
- Invatatorii nu consuma gustari in sala (doar apa)$$),

(null, 'siguranta', 'Inspectarea salii inainte de program', $$- Podeaua si covoarele sunt aspirate si curate
- Prizele sunt acoperite cu capac de protectie
- Dulapioarele sunt organizate si obiectele aranjate
- Jucariile nu sunt rupte sau cu colturi ascutite
- Gustarea, apa si paharele sunt pregatite
- Materialele pentru activitati sunt pregatite
- Exista etichete si markere pentru ecusoane
- Echipamentele audio-video functioneaza; muzica e pornita
- Toti invatatorii s-au spalat pe maini$$),

(null, 'siguranta', 'Curatenia la final de program', $$1. Curata toate mesele si suprafetele plane
2. Strange ecusoanele adultilor in cutie
3. Inchide si incuie dulapurile
4. Pune jucariile la loc si dezinfecteaza-le
5. Stinge echipamentele IT
6. Scoate gunoiul din clasa
7. Arunca fisele si lucrarile mai vechi de 2 saptamani nerevendicate$$),

(null, 'siguranta', 'Ce NU trebuie sa faci', $$- Nu lasa niciodata un copil nesupravegheat
- Nu folosi telefon mobil in timpul slujirii
- Nu da skip rugaciunii inainte de program
- Nu fi plictisitor – e un pacat!
- Nu administra medicamente fara acordul parintilor
- Nu permite parintilor sa intre in sala in timpul programului
- Nu consuma mancare sau cafea in sala de grupa
- Nu lasa copiii singuri cu un singur adult$$);

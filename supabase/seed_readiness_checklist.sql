-- Checklist standard VCE de "lucrare funcțională" — minim pentru orice biserică din rețea.

insert into public.org_readiness_checks (title, description, sort_order) values
('Recepție instalată', 'Procesul de recepție copii e configurat și există cel puțin un responsabil alocat.', 1),
('Curriculum setat', 'Biserica a ales și a încărcat curriculum-ul folosit pentru cel puțin o grupă de vârstă.', 2),
('Minim 2 oameni per grupă', 'Fiecare grupă de vârstă activă are cel puțin doi slujitori alocați (regula celor doi adulți).', 3),
('Organigramă completată', 'Rolurile cheie (coordonator, recepție, curriculum) sunt asignate unor persoane reale.', 4),
('Proceduri de siguranță confirmate', 'Echipa activă a citit și confirmat procedurile de siguranță și urgență.', 5);

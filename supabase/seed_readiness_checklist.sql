-- Checklist standard VCE de "lucrare functionala" — minim pentru orice biserica din retea.

insert into public.org_readiness_checks (title, description, sort_order) values
('Receptie instalata', 'Procesul de receptie copii e configurat si exista cel putin un responsabil alocat.', 1),
('Curriculum setat', 'Biserica a ales si a incarcat curriculum-ul folosit pentru cel putin o grupa de varsta.', 2),
('Minim 2 oameni per grupa', 'Fiecare grupa de varsta activa are cel putin doi slujitori alocati (regula celor doi adulti).', 3),
('Organigrama completata', 'Rolurile cheie (coordonator, receptie, curriculum) sunt asignate unor persoane reale.', 4),
('Proceduri de siguranta confirmate', 'Echipa activa a citit si confirmat procedurile de siguranta si urgenta.', 5);

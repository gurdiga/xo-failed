- cum deschid procedura the Angular way? ngAnimate?
- de încarcat datele procedurii
- de încadrat subsecţiunile din “Obiectul urmăririi” în “Acţiunile procedurale” corespunzătoare.
- lista de acţiuni procedurale
  - borderoul de calcul?
  - concilierea înainte de pasul 7

- script loader?
- de trecut de la a[href] pentru documente

- de migrat spre icon font
  - butoane mari
  - alt font optimizat pentru dimensiuni mici:
    - iconiţe profil şi calculator
    - iconiţă calendar?
    - iconiţă read-only lock
    - iconiţă document pentru butonaşele de încheieri

- <noscript>, unsupported browsers?
- blank slate video/screenshot/help?
- conceive the app personality

- Căutare
  - in loc de proceduri recente, afişează toate procedurile?
    în ordinea descrescătoare timpului ultimei deschideri + încărcare treptată onscroll
  - lazy.js?
  - async.js?

- Admin
  - înregistrare utilizator
    - de creat structura de subdirectoare
  - dezactivare după o perioadă de inactivitate
  - autentificarea mutuală
  - dezactivare la break-in
  - cerinţe de complexitate pentru parolă
  - schimbarea parolei la maxim 3 luni
  - permite utilizatorului să-şi schimbe parola
  - menţine istoria parolelor pentru a preveni repetarea
  - blocare după 3 încercări greşite
  - istoria înregistrărilor

----------------------------------------------------------------------------------------------------
BIBI

- corectat denumirile încheieirilor (Tolea?)
- lejerizează afişarea/ascunderea mesajelor de la butoane (salvare, regenerare, imprimare)
- nicer tooltips?

----------------------------------------------------------------------------------------------------

ÎMBUNĂTĂŢIRI DUPĂ LANSARE

- Introducerea datelor
  - index persoane pentru autocompletare?
  - validare procedură/recente la salvare?
 
- have a App-Version HTTP header injected into nginx.vhost.conf upon reconfiguration upon deploy then have a
  jQuery AJAX filter that looks at it (have a ping bg thingy?)
- de verificat versiunea browserului?

Chestii tehnice
  - try a Centos VM deploy to prepare for Amazon deploy?
  - patch QUnit to unpercent non-english
  - microtemplating: escape html tags in valorile injectate
  - timeout session from JS and logout?
  - bootable tonido flash
  - rollback deploy? deploy stage then switch doc_roots rename? have an optional REVISION=SHA parameter?

- Performanţă
  - performanţă: YSlow & PageSpeed, about:tracing
  - http://www.webpagetest.org/
  - https://developers.google.com/speed/pagespeed/insights
  - de folosit CSS translate pentru animarea formuarului de procedura
  - eliminare $UI?
    - treb’ de mutat imaginile pentru butonaşe inline in CSS
    - calendar alternativ
  - custom build local la $/UI cu Expire la +∞?

- Indexare
  - extrage datele pentru index cu indexOf?
  - index partitioning?
  - JSON-P + custom format + JS worker pentru max performance? experiment: /js/indexer.js

- Convenienţe (“nice to have”s)
  - buton “?” pe bara de instrumente cu intrucţiuni despre formatare
  - de afişat editabilitatea cîmpurile editabile după o pauză de .5s (transition-delay?)
  - better tooltips (bootstrap?)
  - “poliţă” temporară: la click în afara formularului în punem pe poliţă
  - de eliminat titlurile dialogurilor butoanelor de pe bara de sus

- Dev
 - SASS + :autocmd BufWritePost *.sass !compile_sas.sh <afile>

- put htusers.php on github

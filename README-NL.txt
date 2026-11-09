EUROFUEL FINDER – INSTALLATIE OP WINDOWS EN ANDROID
====================================================

Wat zit erin?
- Nederlandstalige installeerbare PWA.
- Keuze uit Euro 95, Euro 98, diesel en LPG.
- Ranglijst op laagste recente prijs of landelijk gemiddelde.
- Aantal tankstations en bron-update tonen.
- Besparingscalculator.
- Offline shell-cache; live prijzen vereisen internet.

BELANGRIJK
De app gebruikt de gratis openbare JSON-samenvatting:
https://www.fuel-prices.eu/live/api.php?action=summary
Volgens de API-documentatie is deze endpoint gratis, zonder API-sleutel, en ondersteunt hij browserverzoeken. Het aanbod is niet heel Europa: alleen landen/brandstoffen waarvoor de bron gegevens publiceert. Duitsland is op dit live-overzicht momenteel uitgesloten. Dit zijn geen prijzen van elk individueel tankstation. Prijzen kunnen wijzigen en zijn geen garantie voor de pompprijs.
Bron/licentie: fuel-prices.eu, CC BY 4.0. Raadpleeg https://www.fuel-prices.eu/api/docs/

STAP 1 – UITPAKKEN
1. Download EuroFuel-Finder.zip op je Windows-computer.
2. Klik met rechts op het ZIP-bestand > Alles uitpakken.
3. Open de map EuroFuel-Finder.

STAP 2 – ONLINE ZETTEN (GRATIS MET GITHUB PAGES)
Een PWA kan op Android alleen volledig installeerbaar worden aangeboden via HTTPS (of localhost).
1. Maak gratis een account op https://github.com/
2. Klik op New repository.
3. Naam: eurofuel-finder
4. Kies Public en klik Create repository.
5. Upload alle bestanden uit deze map (index.html, app.js, sw.js, manifest.webmanifest, icon.svg). README mag ook.
6. Ga in de repository naar Settings > Pages.
7. Bij Build and deployment kies je Deploy from a branch.
8. Branch: main; folder: /(root); klik Save.
9. Wacht tot GitHub Pages een adres toont, bijvoorbeeld https://JOUW-GITHUBNAAM.github.io/eurofuel-finder/
   Gebruik het adres dat GitHub zelf toont; de naam hierboven is alleen een voorbeeld.

STAP 3 – TESTEN OP WINDOWS
1. Open de GitHub Pages-link in Chrome of Edge.
2. Je moet een ranglijst en statusmelding zien.
3. Kies brandstof en controleer of de prijzen veranderen.
4. Klik op Prijzen vernieuwen.

STAP 4 – INSTALLEREN OP ANDROID
1. Open dezelfde HTTPS-link op je Android-telefoon in Chrome.
2. Tik op ⋮ (rechtsboven).
3. Kies App installeren of Toevoegen aan startscherm.
4. Bevestig. EuroFuel Finder verschijnt tussen je apps.

PROBLEMEN OPLOSSEN
- Geen prijzen: controleer internet en probeer Vernieuwen.
- Geen installatieoptie: controleer of je GitHub Pages HTTPS-link gebruikt en open die in Chrome.
- Veranderingen niet zichtbaar: sluit de app helemaal en open opnieuw; vernieuw de pagina.
- De app toont alleen landen met beschikbare brondata. Een lege waarde betekent ontbrekende data, niet gratis brandstof.

KOSTEN
De app-code, API en GitHub Pages hebben een gratis gebruiksroute. GitHub-account en internetverbinding zijn nodig. Er is geen APK-build of Google Play-publicatie inbegrepen.

# Rette deinen Nahverkehr

Offene Fahrplandaten statt vernagelter Systeme

## Aktionswebseite

Diese Seite basiert auf [jekyll](https://jekyllrb.com).

Für die Auflösung PLZ -> Ansprechpartner, passieren mehrere Schritte:
* PLZ zu Landkreiskennzahl (adminCode3) über die geonames.org-API
* Falls kein adminCode3 vorhanden, Auflösung mit `js/geonamesfix.js`
* Nachschlagen von Ansprechpartner, Verkehrsverbund, etc. durch [tabletop](https://github.com/jsoma/tabletop) in Google Sheets

Die Daten stammen von GeoNames, Wikidata und manueller Sammlung aus Stadt-/Landkreiswebsites.


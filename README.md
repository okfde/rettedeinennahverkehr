# Rette deinen Nahverkehr

Offene Fahrplandaten statt vernagelter Systeme.
[rettedeinennahverkehr.de](https://rettedeinennahverkehr.de/)

## Aktionswebseite

Diese Seite basiert auf [jekyll](https://jekyllrb.com).

Für die Auflösung PLZ -> Ansprechpartner, passieren zwei Schritte:
* PLZ zu Landkreiskennzahl (adminCode3) über die `data/plz2lkr.csv` (Q: [http://opendata.blattspinat.com](http://opendata.blattspinat.com))
* Nachschlagen von Ansprechpartner, Verkehrsverbund, etc. durch [tabletop](https://github.com/jsoma/tabletop) in Google Sheets

Die Daten stammen aus der OpenStreetMap, GeoBasis-DE / BKG 2015, Wikidata und manueller Sammlung aus Stadt-/Landkreiswebsites.


var ort = '', landkreis = '', ags = '', lra = '', ar = '', arn = '',
    sge = '', lvn = '', lnn = '', str = '', lraplz = '', stt = '',
    vbd = '', tel = '', plz = '', goog = false;

function generateText() {
  var intro = '';

  if (sge.length > 0 && ar.length > 0 && lnn.length > 0) {
    intro = sge + " " + ar + " " + lnn + ",";
  }

  var text = (intro + "\n\n" +
    "Leider musste ich feststellen, dass unser Verkehrsverbund " + vbd + " keinen Fahrplandatensatz für Softwareentwickler " +
    "in einem maschinenlesbaren Format zur Verfügung stellt. Mit diesen Daten könnten " +
    "Softwareentwickler (private, ehrenamtliche Entwickler*innen sowie auch Firmen) innovative " +
    "Apps für das " + vbd + "-Gebiet bereitstellen.\n" +
    "\n" +
    (goog ?
    "Aktuell werden die " + vbd + "-Sollfahrplandaten im GTFS-Format offenbar exklusiv an Google Maps abgegeben. " +
    "Das heißt, die Daten liegen bereits im passenden Format vor, werden aber nicht der Allgemeinheit " +
    "zur Verfügung gestellt. Es wäre sehr schade, wenn nur Google oder Firmen mit großer Rechtsabteilung an " +
    "zukunftsträchtigen Mobilitätslösungen bei uns arbeiten dürften.\n" +
    "\n" : "") +
    "Vor allem Apps für spezielle Anwendungsfälle, wie z.B. Verbindungsauskunftsapps für blinde Menschen, " +
    "bei denen die Auskunft per Sprachausgabe realisiert wird, können von freigegebenen Fahrplandaten profitieren. " +
    "Für die Entwicklung von solchen Spezialanwendungen fehlen beim Verbund wahrscheinlich die Ressourcen, " +
    "aber durch die Freigabe der Daten können diese Anwendungen trotzdem ohne Zusatzkosten für den Verbund bereit gestellt werden." +
    "\n" +
    "Besonders für Touristen wird es durch die Datenfreigabe einfacher sich im ÖPNV zu bewegen, " +
    "weil sich diese nicht für jeden Ort erst die passende Nahverkehrsapp herunterladen müssen. " +
    "Denn so können Reisende bereits vorhandene und verbreitete Apps nutzen, welche Verbundübergreifend funktionieren, " +
    "da die Anwendungen auf das verbreitete GTFS-Format setzen." +
    "\n" +
    "Auch werden Apps möglich, welche die schönsten, mit dem ÖPNV erreichbaren Ausflugsziele der Region anbieten " +
    "und so neue Nutzergruppen für den ÖPNV und die Region begeistern können.\n" +
    "\n" +
    "Dabei wäre es sehr wichtig, dass die " + vbd + "-Fahrplandaten unter einer offenen Lizenz bereitgestellt werden. " +
    "Nur so können Entwickler Anwendungen mit diesen Daten entwickeln oder in bestehende Apps integrieren, " +
    "ohne sich bei jedem Verkehrsbetreiber wieder neu mit rechtlichen Fragen und Verträgen zu beschäftigen, " +
    "was die Entwicklung massiv behindert bzw. sogar unmöglich macht.\n" +
    "\n" +
    "Ich würde mich sehr freuen, wenn Sie bei der nächsten " + vbd + "-Mitgliederversammlung darauf " +
    "hinwirken würden, dass die " + vbd + "-Fahrplandaten im freien Fahrplanformat GTFS und unter " +
    "offener Lizenz allen interessierten Entwickler*innen ohne Einschränkung als Open Data zur Verfügung " +
    "gestellt werden.\n" +
    "\n" +
    "Ich freue mich auf Ihre Antwort und stehe bei Rückfragen gerne zur Verfügung.\n" +
    "\n" +
    "Mit freundlichen Grüßen");
  return text;
}

function renderPDF() {
  var name= $("#name").val();
  var address= $("#address").val();
  var city = $("#city").val();
  var intro = '';

  if (sge.length > 0 && ar.length > 0 && lnn.length > 0) {
    intro = sge + " " + ar + " " + lnn + ",";
  }

  var text = generateText();

  var d = new Date(),
      months = 'Januar,Februar,März,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember'.split(','),
      datum = d.getDate() + ". " + months[d.getMonth()] + " "+ d.getFullYear();

  var sender = "\n\n";
  if (name.length > 0 && address.length > 0 && city.length > 0) {
    sender = name + "\n" + address + "\n" + plz + " " + city;
  }

  var doc = new jsPDF();
  doc.setFontSize(11);
  doc.text(20,  45, lra + "\n\n" + arn + " " + lvn + " " + lnn + "\n" + str + "\n" + lraplz + " " + stt);
  doc.text(150,  27, sender + "\n\n" + datum);

  lines = doc.splitTextToSize(text, 160);
  doc.text(20, 85, lines);
  doc.setDrawColor(100, 100, 100);

  var y = 240;
  if (goog) {
    y = 270;
  }

  // doc.line(20, y, 80, y);
  doc.text(20, y + 10, name);

  doc.output("dataurlnewwindow");
}

function hideAll() {
  $('#actionError').hide();
  $('#actionStillLoading').hide();
  $('#actionResult').hide();
  $('#actionResultHasData').hide();
  $('.letter-text').hide();
}

var sheetUrl = 'https://docs.google.com/spreadsheets/d/1MNPMJGdsoKYNwmdMAE3R8rZSO0B5jxrtlvadrFfMyQ8/pubhtml',
    lkrData = {},
    plzData = {},
    loaded = 0,
    thanked = false;

$(document).ready(function() {
  Tabletop.init({
    key: sheetUrl,
    simpleSheet: true,
    postProcess: function(row) {
      row['gtfs'] = (row['gtfs'].toLowerCase() == 'true');
    },
    callback: function(data) {
      $.each(data, function(idx, row) {
        lkrData[row['AdminCode3']] = row;
      });
      loaded++;
      // if somebody already tried to use it, do it again (now with data)
      $('#plz').trigger('change');
    }
  });

  Papa.parse('data/plz2lkr.csv', {
    download: true,
    header: true,
    step: function(row) {
      plzData[row.data[0].plz] = row.data[0];
    },
    complete: function() {
      loaded++;
      $('#plz').trigger('change');
    }
  });

  $('#plz-form').on('submit', function(ev) {
    ev.preventDefault();
    return false;
  });

  $('#plz').on('keyup change', function() {
    plz = $(this).val();
    if (plz.length <= 4) {
      hideAll();
      return;
    }
    if (loaded < 2) {
      $('#actionStillLoading').show();
      return;
    }
    hideAll();

    if (typeof plzData[plz] == "undefined") {
      $('#actionError').show();
      return;
    }

    ort = plzData[plz].ort;
    landkreis = plzData[plz].landkreis;
    ags = plzData[plz].ags;
    if (typeof ags == "undefined") {
      hideAll();
      $('#actionError').show();
    }

    $('#plzrepeat').text(plz);

    var data = lkrData[ags];
    if (typeof data == "undefined") {
      $('#actionError').show();
      return;
    }

    vbd = data['Verbund'];
    $('.data-vbd').text(vbd);
    if (data['gtfs']) {
      $('#actionResultHasData').show();
      return;
    }

    lra = data['Behörde'];
    ar = data['ChefHerrFrau'];
    arn = data['CHFn'];
    sge = data['Anrede'];
    lvn = data['ChefVorname'];
    lnn = data['ChefNachname'];
    str = data['Sitz (Straße)'];
    lraplz = data['Sitz (PLZ)'];

    if (data['AbwPostAdr'] != "" && data['AbwPLZ'] != "") {
      str = data['AbwPostAdr'];
      lraplz = data['AbwPLZ'];
    }

    stt = data['Sitz (Gemeinde)'];
    tel = data['Telefon'];
    var cleanTel = (tel || '').replace(/\D/g, '');

    goog = (data['google'].toLowerCase() == 'true');

    $('#actionResult')[goog ? 'addClass' : 'removeClass']('has-google-gtfs');
    $('#city').val(ort);
    $('.data-tel').attr('href', 'tel:' + cleanTel).text(tel);
    $('.data-tel-name').text(arn + " " + lvn + " " + lnn);
    $('#actionResult').show();
  });

  $('.action-generate-pdf').click(function(ev) {
    ev.preventDefault();
    renderPDF();
    $('.action-thankyou').show();
  });

  $('.action-copy-text').click(function(ev) {
    ev.preventDefault();
    var address = lra + "\n" + arn + " " + lvn + " " + lnn + "\n" + str + "\n" + lraplz + " " + stt + "\n\n";
    $('.letter-text').text(address + generateText()).show();
    $('.letter-text').get(0).select();
    $('.action-thankyou').show();
  });

  $('.tab-link-telephone').click(function() {
    if (thanked) {
      return;
    }
    setTimeout(function() {
      $('.action-thankyou').show();
      thanked = true;
    }, 10*1000);
  });
});

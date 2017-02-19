var ort = '', landkreis = '', ags = '', lra = '', ar = '', arn = '',
    sge = '', lvn = '', lnn = '', str = '', lraplz = '', stt = '',
    vbd = '', tel = '', plz = '', goog = false;

function renderPDF() {
	var name= $("#name").val();
	var address= $("#address").val();
	var city = $("#city").val();
  var intro = '';

  if (sge.length > 0 && ar.length > 0 && lnn.length > 0) {
    intro = sge + " " + ar + " " + lnn + ",";
  }

	var text = (intro + "\n\n" +
    "Leider musste ich feststellen, dass der " + vbd + " keinen Soll-Fahrplandatensatz für Softwareentwickler " +
    "in einem maschinenlesbaren Format (z.B. GTFS) zur Verfügung stellt. Mit diesen Daten könnten " +
    "Softwareentwickler (private, ehrenamtliche Entwickler*innen sowie auch Firmen) innovative " +
    "Auskunfts-Apps für das " + vbd + "-Gebiet bereitstellen.\n" +
    "\n" +
    (goog ?
    "Aktuell werden die " + vbd + "-Sollfahrplandaten im GTFS-Format offenbar exklusiv an Google Maps abgegeben. " +
    "Das heißt, die Daten liegen bereits im passenden Format vor, werden aber nicht der Allgemeinheit " +
    "zur Verfügung gestellt. Es wäre sehr schade, wenn nur Google oder Firmen mit großer Rechtsabteilung an " +
    "zukunftsträchtigen Mobilitätslösungen bei uns arbeiten dürften.\n" +
    "\n" : "") +
    "Beispiele für bereits existierende Anwendungen, welche diese offenen Fahrplandaten verwenden " +
    "können, sind z.B. TransitApp und Citymapper, die auch ohne Internetverbindung funktionieren " +
    "oder das Projekt digitransit (http://tinyurl.com/digitransit-ulm), welches die freigegebenen " +
    "Daten der Stadtwerke Ulm benutzt. Auch Tür-zu-Tür-Auskünfte über Verkehrsmittel- und Verbundgrenzen " +
    "hinweg sind so möglich – oder auch eine App, die die schönsten, mit dem ÖPNV erreichbaren " +
    "Ausflugsziele der Region anbietet.\n" +
    "\n" +
    "Ich würde mich sehr freuen, wenn Sie bei der nächsten " + vbd + "-Mitgliederversammlung darauf " +
    "hinwirken würden, dass die " + vbd + "-Fahrplandaten im freien Fahrplanformat GTFS und unter " +
    "offener Lizenz allen interessierten Entwickler*innen ohne Einschränkung als Open Data zur Verfügung " +
    "gestellt werden.\n" +
    "\n" +
    "Ich freue mich auf Ihre Antwort und stehe bei Rückfragen gerne zur Verfügung.\n" +
    "\n" +
    "Mit freundlichen Grüßen");

  var d = new Date(),
      months = 'Januar,Februar,März,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember'.split(','),
      datum = d.getDate() + ". " + months[d.getMonth()] + " "+ d.getFullYear();

  var sender = "\n\n";
  if (name.length > 0 && address.length > 0 && city.length > 0) {
    sender = name + "\n" + address + "\n" + plz + " " + city;
  }

	var doc = new jsPDF();
	doc.setFontSize(13);
  doc.text(20,  46, lra)
	doc.text(20,  56, arn + " " + lvn + " " + lnn)
	doc.text(20,  64, str);
	doc.text(20,  74, lraplz + " " + stt);
	doc.text(150,  30, sender + "\n\n" + datum)

	lines = doc.splitTextToSize(text, 160)
	doc.text(20, 100, lines)
	doc.setDrawColor(100,100,100);

  var y = 240;
  if (goog) {
    y = 270;
  }

//	doc.line(20, y, 80, y);
	doc.text(20, y + 10, name);

	doc.output("dataurlnewwindow");
}

function hideAll() {
  $('#actionError').hide();
  $('#actionStillLoading').hide();
  $('#actionResult').hide();
  $('#actionResultHasData').hide();
}

var sheetUrl = 'https://docs.google.com/spreadsheets/d/1MNPMJGdsoKYNwmdMAE3R8rZSO0B5jxrtlvadrFfMyQ8/pubhtml',
    lkrData = {},
    loaded = false,
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
      loaded = true;
      // if somebody already tried to use it, do it again (now with data)
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
    if (!loaded) {
      $('#actionStillLoading').show();
      return;
    }
    $.getJSON('https://rettedeinennahverkehr.de/api/gn-plz?country=DE&callback=?', { postalcode: plz }, function(response) {
      hideAll();
      if (!response || typeof response.postalcodes == 'undefined' || response.postalcodes.length <= 0 || !response.postalcodes[0].placeName) {
        $('#actionError').show();
        return;
      }

      var data = response.postalcodes[0];
      ort = data.placeName;
      landkreis = data.adminName3;
      ags = data.adminCode3;
      if (typeof ags == "undefined") {
        ags = data.adminCode2;
      }
      if (typeof ags == "undefined" || ags == "00") {
        ags = geonamesfix[plz];
      }
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
    }).fail(function() {
      $('#actionError').show();
    });
  });

  $('.action-generate-pdf').click(function(ev) {
    ev.preventDefault();
    renderPDF();
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

var ort = '', landkreis = '', ags = '', lra = '', ar = '', arn = '',
    sge = '', lvn = '', lnn = '', str = '', lraplz = '', stt = '',
    vbd = '', tel = '', plz = '';

function renderPDF() {
	var name= $("#name").val();
	var address= $("#address").val();
	var city = $("#city").val();
  var intro = '';

  if (sge.length > 0 && ar.length > 0 && lnn.length > 0) {
    intro = sge + " " + ar + " " + lnn + ",";
  }

	var text = (intro + "\n\n" +
    "mit einiger Empörung durfte ich der Lügenpresse entnehmen, dass unser Verkehrsverbund " + vbd +  " seine Fahrplandaten " +
    "zwar mit Google teilt, nicht jedoch mit einheimischen Entwickler*innen. Sicher verstehen Sie, dass es auf diese " +
    "Weise mit Industrie 4.0 in Deutschland und moderner Mobilität nix werden kann.\n\nIch würde mich sehr freuen, " +
    "wenn Sie bei der nächsten " + vbd + "-Mitgliederversammlung darauf hinwirken würden, dass die " + vbd + "-Fahrplandaten " +
    "im freien Fahrplanformat GTFS und unter offener Lizenz allen interessierten Entwickler*innen zur Verfügung gestellt werden.");

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
	doc.line(20, 215, 80, 215);
	doc.text(20, 222, name);

	doc.output("dataurlnewwindow");
}

var sheetUrl = 'https://docs.google.com/spreadsheets/d/1MNPMJGdsoKYNwmdMAE3R8rZSO0B5jxrtlvadrFfMyQ8/pubhtml',
    lkrData = {};

function hideAll() {
  $('#actionError').hide();
  $('#actionResult').hide();
  $('#actionResultHasData').hide();
}

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
    }
  });

  $('#plz').on('keyup change', function() {
    plz = $(this).val();
    if (plz.length <= 4) {
      hideAll();
      return;
    }
    $.getJSON('https://schmidt.okfn.de/gn-plz?&country=DE&callback=?', { postalcode: plz }, function(response) {
      if (!response || typeof response.postalcodes == 'undefined' || response.postalcodes.length <= 0 || !response.postalcodes[0].placeName) {
        hideAll();
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
      if (data['gtfs']) {
        $('#agency').text(vbd);
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

      $('#city').val(ort);

      $('#tel').attr('href', 'tel:' + cleanTel).text(tel);
      $('#tel-name').text(arn + " " + lvn + " " + lnn);
      $('#actionResult').show();
    }).fail(function() {
      $('#actionError').show();
    });
  });

  $('.action-generate-pdf').click(renderPDF);
});

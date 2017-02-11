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
    "mit einiger Empörung durfte ich der Lügenpresse entnehmen, dass der hiesige Verkehrsverbund seine Fahrplandaten " +
    "zwar mit Google teilt, nicht jedoch mit einheimischen Entwickler*innen. Sicher verstehen Sie, dass es auf diese " +
    "Weise mit Industrie 4.0 in Deutschland und moderner Mobilität nix werden kann.\n\nIch würde mich sehr freuen, " +
    "wenn Sie bei der nächsten Mitgliederversammlung des VVS darauf hinwirken würden, dass die Fahrplandaten des VVS " +
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
	doc.text(20, 222, "name");

	doc.output("dataurlnewwindow");
}

$(document).ready(function() {
  $('#actionResult').hide();

  $('#plz').keyup(function() {
    plz = $(this).val();
    if (plz.length <= 4) {
      $('#actionError').hide();
      $('#actionResult').hide();
      return;
    }
    $.getJSON('https://schmidt.okfn.de/gn-plz?&country=DE&callback=?', {postalcode: plz }, function(response) {
      if (!response || typeof response.postalcodes == 'undefined' || response.postalcodes.length <= 0 || !response.postalcodes[0].placeName) {
        return;
      }

      var data = response.postalcodes[0];
      ort = data .placeName;
      landkreis = data.adminName3;
      ags = data.adminCode3;

      $('#plzrepeat').text(plz);

      $.getJSON('/data/' + ags + ".json", function(response) {
        if (!response) {
          return;
        }

        lra = response.ad1;
        ar = response.ar;
        arn = response.arn;
        sge = response.sge;
        lvn = response.lvn;
        lnn = response.lnn;
        str = response.str;
        lraplz = response.plz;
        stt = response.stt;
        vbd = response.vbd;
        tel = response.tel;

        $('#tel').text(tel);
        $('#tel-name').text(arn + " " + lvn + " " + lnn);
        $('#actionResult').show();
      }).fail(function() {
        $('#actionError').show();
      });
    }).fail(function() {
      $('#actionError').show();
    });
  });

  $('.action-generate-pdf').click(renderPDF);
});

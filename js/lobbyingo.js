function renderPDF() {
	var name= $("#name").val()
	var address= $("#address").val()
	var city = $("#city").val()
	var text = ("Sehr geehrter König von Stuttgart,\n\nmit einiger Empörung durfte ich der Lügenpresse entnehmen, dass der hiesige Verkehrsverbund seine Fahrplandaten zwar mit Google teilt, nicht jedoch mit einheimischen Entwickler*innen. Sicher verstehen Sie, dass es auf diese Weise mit Industrie 4.0 in Deutschland und moderner Mobilität nix werden kann.\n\nIch würde mich sehr freuen, wenn Sie bei der nächsten Mitgliederversammlung des VVS darauf hinwirken würden, dass die Fahrplandaten des VVS im freien Fahrplanformat GTFS und unter offener Lizenz allen interessierten Entwickler*innen zur Verfügung gestellt werden.");

	var doc = new jsPDF();
	doc.setFontSize(13);
	doc.text(20,  56, "König von Stuttgart")
	doc.text(20,  64, "Schlossgarten");
	doc.text(20,  74,"Stuttgart");
	doc.text(150,  30, name + "\n" + address + "\n" + city + "\nDatum")

	lines = doc.splitTextToSize(text, 160)
	doc.text(20, 100, lines)
	doc.setDrawColor(100,100,100);
	doc.line(20, 215, 80, 215);
	doc.text(20, 222, "name");

	doc.output("datauri");
}


$(document).ready(function() {

   // auto complete city via zip code
   $('#plz').keyup(function() {
    if ($(this).val().length > 4) {
      var ort = $('#ort');
      var landkreis = $('#landkreis');
      var ags = $('#ags');
      var lra = $('#lra');
      var ar = $('#ar');
      var arn = $('#arn');
      var sge = $('#sge');
      var lvn = $('#lvn');
      var lnn = $('#lnn');
      var str = $('#str');
      var lraplz = $('#lraplz');
      var stt = $('#stt');
      var vbd = $('#vbd');
      var tel = $('#tel');
      $.getJSON('https://schmidt.okfn.de/gn-plz?&country=DE&callback=?', {postalcode: this.value }, function(response) {
        if (response && response.postalcodes.length && response.postalcodes[0].placeName) {
          ort.val(response.postalcodes[0].placeName);
          landkreis.val(response.postalcodes[0].adminName3);
          ags.val(response.postalcodes[0].adminCode3);
          $.getJSON('/data/' + ags.val() + ".json", function(response) {
            if (response) {
              lra.val(response.ad1);
              ar.val(response.ar);
              arn.val(response.arn);
              sge.val(response.sge);
              lvn.val(response.lvn);
              lnn.val(response.lnn);
              str.val(response.str);
              lraplz.val(response.plz);
              stt.val(response.stt);
              vbd.val(response.vbd);
              tel.val(response.tel);
              $('#briefgenerator').show();
            }
          })
        }
      })
    } else {
      $('#ort').val('');
      $('#landkreis').val('');
      $('#ags').val('');
      $('#lra').val('');
      $('#ar').val('');
      $('#arn').val('');
      $('#sge').val('');
      $('#lvn').val('');
      $('#lnn').val('');
      $('#str').val('');
      $('#lraplz').val('');
      $('#stt').val('');
      $('#vbd').val('');
      $('#tel').val('');
      $('#briefgenerator').hide();
    }
  });

});

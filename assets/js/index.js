var tableCDR;

$(document).ready(function () {
  tableCDR = $("table#dataCDR").dataTable({
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>T",
    "bAutoWidth": false,
    "aoColumns": [{ "sWidth": "20%" }, { "sWidth": "15%" }, { "sWidth": "15%" }, { "sWidth": "20%" }, { "sWidth": "15%" }, { "sWidth": "15%" }],
    "oTableTools": {
      "sSwfPath": "assets/swf/copy_csv_xls_pdf.swf",
      "aButtons": [ "copy", "print", "csv", "pdf" ]
    }
  });

  $("#setupForm").ajaxForm(function (code) {
    if (code) {
      // TODO: Notify success.
    } else {
      // TODO: Notify failure.
    }
  });
});

$(function () {
  $("#from").datepicker({
    changeMonth: false,
    numberOfMonths: 1,
    dateFormat: "yy-mm-dd",
    maxDate: 0,
    onClose: function (selectedDate) {
      $("#to").datepicker("option", "minDate", selectedDate);
    }
  });
  $("#to").datepicker({
    changeMonth: false,
    numberOfMonths: 1,
    dateFormat: "yy-mm-dd",
    maxDate: 0,
    onClose: function (selectedDate) {
      $("#from").datepicker("option", "maxDate", selectedDate);
    }
  });

  $("#data").hide();
});

$("#show").click(function () {
  $.ajax({
    type: "POST",
    url: "includes/process.php",
    data: {
      exten: $("#exten").val(),
      from: $("#from").val(),
      to: $("#to").val()
    }
  }).done(function (html) {
    var json = JSON.parse(html);
    if (json.status.code == 200) {
      
      $("#data").show();

      var tableToolsInstance = TableTools.fnGetInstance("dataCDR");
      if ( tableToolsInstance != null && tableToolsInstance.fnResizeRequired() ) {
          tableToolsInstance.fnResizeButtons();
      }

      for (var i = 0; i < json.data.length; i++) {
        tableCDR.fnAddData([json.data[i].calldate, json.data[i].src, json.data[i].dst, json.data[i].disposition, json.data[i].billsec, json.data[i].minutes]);
      }
    }
  });
});

$("#erase").click(function () {
  $("#data").hide();
  tableCDR.fnClearTable();

  $('.hasDatepicker').datepicker({ minDate: null, maxDate: null });
});

$("#saveSetup").click(function () {
  $("#setupForm").submit();
});

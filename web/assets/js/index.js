var tableCDR;

$(document).ready(function () {
  tableCDR = $("table#dataCDR").dataTable({
    sDom: '<"da-form"<"da-form-block"lfrtip><"btn-row DT-btn-row"T>>',
    aoColumns: [{ "sWidth": "20%" }, { "sWidth": "15%" }, { "sWidth": "15%" }, { "sWidth": "20%" }, { "sWidth": "15%" }, { "sWidth": "15%" }],
    iDisplayLength: 100,
    oTableTools: {
      sSwfPath: "assets/plugins/datatables/swf/copy_csv_xls_pdf.swf",
      aButtons: [
        {
          "sExtends": "print",
          "sButtonText": "Imprimir"
        },
        {
          "sExtends": "xls",
          "sButtonText": "Exportar a Excel",
          "sFileName": "Stats - Llamadas.xls"
        },
        {
          "sExtends": "pdf",
          "sButtonText": "Exportar en PDF",
          "sFileName": "Stats - Llamadas.pdf"
        },
        {
          "sExtends": "csv",
          "sButtonText": "Exportar como CSV",
          "sFileName": "Stats - Llamadas.csv"
        },
      ],
    }
  });

  $('.DTTT a').addClass('btn-success DTTT-condenser');
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
      if (selectedDate) $("#from").datepicker("option", "maxDate", selectedDate);
    }
  });

  $("#data").hide();

  $("#helpModal").dialog({
    autoOpen: false,
    title: "Para usar esta herramienta",
    modal: true,
    width: "550",
    buttons: [{
      text: "Cerrar",
      click: function() {
        $( this ).dialog( "close" );
      }
    }]
  });

  $("#aboutModal").dialog({
    autoOpen: false,
    title: "Acerca de esta herramienta",
    modal: true,
    width: "550",
    buttons: [{
      text: "Cerrar",
      click: function() {
        $( this ).dialog( "close" );
      }
    }]
  });

  $("#helpModalDispatcher").bind("click", function(event) {
    $("#helpModal").dialog("option", {modal: true}).dialog("open");
    event.preventDefault();
  });

  $("#aboutModalDispatcher").bind("click", function(event) {
    $("#aboutModal").dialog("option", {modal: true}).dialog("open");
    event.preventDefault();
  });
});

$("#show").click(function () {
  $.ajax({
    type: "POST",
    url: "includes/process.php",
    data: {
      disposition: $("#disposition").val(),
      exten: $("#exten").val(),
      from: $("#from").val(),
      to: $("#to").val()
    }
  }).done(function (html) {
    var json = JSON.parse(html);
    if (json.status.code == 200) {
      
      tableCDR.fnClearTable();

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
  $.ajax({
    type: "POST",
    url: "includes/setup.php",
    data: {
      host: $("#host").val(),
      user: $("#user").val(),
      pass: $("#pass").val(),
      port: $("#port").val(),
      name: $("#name").val(),
      table: $("#table").val()
    }
  }).done(function (json) {
    var json = JSON.parse(json);
    if (json.message != "") {
      $.jGrowl(json.message, {position: "bottom-left"});
    }
  });
});

// For Setup Modal
$('#showpass').click(function () {
  if ($(this).hasClass('btn-success')) {
    $('#pass').prop('type', 'text');
    $(this).removeClass('btn-success');
    $(this).addClass('btn-danger');
    $(this).html('Mostrar');
  } else if ($(this).hasClass('btn-danger')) {
    $('#pass').prop('type', 'password');
    $(this).removeClass('btn-danger');
    $(this).addClass('btn-success');
    $(this).html('Ocultar');
  }
});



function init() {
  console.log('init');
  
    $('#title').html(testData.title);
  
    // Filters
    var filters = [];
    filters[0] = $('input#authority');
    filters[1] = $('input#form');
    filters[2] = $('input#notice-title');
    filters[3] = $('input#procurement-type');
    filters[4] = $('select#framework');
    filters[5] = $('input#publication-date');
    filters[7] = $('input#contract-item');
    filters[8] = $('input#contract-number');
    filters[9] = $('input#lot-id');
    filters[12] = $('input#contractor');
    filters[13] = $('input#awarded-value');
  
    for (var i = 0; i < filters.length; i++) {
      if (filters[i]) {
        (function (index, elem) {
          elem.on('keyup click change', function () {
            filterColumn(index, elem);
          });
        })(i, filters[i]);
      }
    }
  
    // Reset
    $('#reset').on('click', function () {
      for (var i = 0; i < filters.length; i++) {
        if (filters[i]) {
          filters[i].val('');
          filterColumn(i, filters[i]);
        }      
      }
      $('#report-table').DataTable().draw();
    });
  
    // Init table
    $('#report-table').DataTable({
  
      columns: [
        {
          title: 'Contracting Authority name'
        },
        {
          title: 'Form'
        },
        {
          title: 'Title of the notice'
        },
        {
          title: 'Procurement type'
        },
        {
          title: 'Framework agreement'
        },
        {
          title: 'Publication date'
        },
        {
          title: 'URL notice'
        },
        {
          title: 'Contract Item'
        },
        {
          title: 'Contract N°'
        },
        {
          title: 'Lot ID'
        },
        {
          title: 'Contract Title'
        },
        {
          title: '# Offers'
        },
        {
          title: 'Contractor awarded'
        },
        {
          title: 'Awarded Value (€)'
        }
      ],
      data: testData.data,
      rowsGroup: [
        0,
        1,
        2,
        3,
        4,
        5,
        6
      ],
      paging: false
    });
  
  }
  
  function getData(url) {
    return (function () {
      var json = null;
      $.ajax({
        'async': false,
        'global': false,
        'url': url,
        'dataType': "json",
        'success': function (data) {
          json = data;
        }
      });
      return json;
    })();
  }
  
  function filterColumn(i, elem) {
    console.log('> filterColumn', i, elem.val());
    $('#report-table').DataTable().column(i).search(
      elem.val()
    ).draw();
  }
  
  $(document).ready(init);
  
  var testData = {
    title: "Court of Justice of the European Union",
    data: [
      [
        "Court of Justice of the European Union, direction générale des infrastructures, direction des bâtiments",
        "3",
        "Improvement and alteration works for secure premises",
        "Restricted procedure",
        "",
        "05/03/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:074977-2016:TEXT:EN:HTML",
        "1",
        "",
        "",
        "",
        "-1",
        "unsuccessful procedure",
        "0"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Improvement and repair of architectural features and of finishings — installation of technical equipment",
        "Open procedure",
        "YES",
        "29/06/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:219862-2016:TEXT:EN:HTML",
        "1",
        "",
        "1",
        "Enclosed and covered features",
        "-1",
        "Not awarded",
        "0"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Improvement and repair of architectural features and of finishings — installation of technical equipment",
        "Open procedure",
        "YES",
        "29/06/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:219862-2016:TEXT:EN:HTML",
        "2",
        "2",
        "2",
        "Finishings: metal joinery; wood joinery; interior structures; coverings",
        "2",
        "Office Partner SA",
        "€ 2 800 288,25"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Improvement and repair of architectural features and of finishings — installation of technical equipment",
        "Open procedure",
        "YES",
        "29/06/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:219862-2016:TEXT:EN:HTML",
        "3",
        "3",
        "3",
        "Electrical technical equipment: electricity, lighting, fire safety, access control, video surveillance, cabling, computer cabling",
        "4",
        "A+P Kieffer Omnitec S.à r.l.",
        "€ 1 595 788,88"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Improvement and repair of architectural features and of finishings — installation of technical equipment",
        "Open procedure",
        "YES",
        "29/06/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:219862-2016:TEXT:EN:HTML",
        "4",
        "4",
        "4",
        "Technical HVAC equipment: thermal energy measurement equipment, valves, temperature control taps, self-closing taps, plumbing",
        "2",
        "A+P Kieffer Omnitec S.à r.l.",
        "€ 904 332,75"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Supply, installation and maintenance of smoking booths for the Court of Justice of the European Union",
        "Open procedure",
        "YES",
        "26/06/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:294883-2016:TEXT:EN:HTML",
        "1",
        "",
        "",
        "Supply, installation and maintenance of smoking booths for the Court of Justice of the European Union",
        "2",
        "QleanAir Scandinavia AB Belgium",
        "€ 247 060"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Supply of subscriptions to specialist periodicals",
        "Open procedure",
        "YES",
        "04/10/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:342917-2016:TEXT:EN:HTML",
        "1",
        "1",
        "1",
        "AT Austria",
        "1",
        "Goethe + Schweitzer GmbH",
        "€ 75 000"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Supply of subscriptions to specialist periodicals",
        "Open procedure",
        "YES",
        "04/10/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:342917-2016:TEXT:EN:HTML",
        "2",
        "2-1",
        "2",
        "BE Belgium",
        "3",
        "LM Information Delivery",
        "€ 130 000"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Supply of subscriptions to specialist periodicals",
        "Open procedure",
        "YES",
        "04/10/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:342917-2016:TEXT:EN:HTML",
        "3",
        "2-2",
        "2",
        "BE Belgium",
        "3",
        "Goethe + Schweitzer GmbH",
        "€ 130 000"
      ],
      [
        "Court of Justice of the European Union",
        "F03",
        "Supply of subscriptions to specialist periodicals",
        "Open procedure",
        "YES",
        "04/10/2016",
        "http://ted.europa.eu/udl?uri=TED:NOTICE:342917-2016:TEXT:EN:HTML",
        "4",
        "2-3",
        "2",
        "BE Belgium",
        "3",
        "Houtschild International Booksellers",
        "€ 130 000"
      ]
    ]
  };
  
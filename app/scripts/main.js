function init() {

  // Filters
  const filters = [];
  filters[0] = $('input#authority');
  filters[1] = $('input#form');
  filters[2] = $('input#notice-title');
  filters[3] = $('input#procurement-type');
  filters[4] = $('select#framework');
  filters[5] = $('input#publication-date');
  // filters[7] = $('input#contract-item');
  // filters[8] = $('input#contract-number');
  // filters[9] = $('input#lot-id');
  filters[10] = $('input#contract-title');
  filters[12] = $('input#contractor');
  filters[13] = $('input#awarded-value');

  for (let i = 0; i < filters.length; i++) {
    if (filters[i]) {
      ((index, elem) => {
        filters[i].on('keyup click change', () => {
          filterColumn(index, elem);
        });
      })(i, filters[i]);
    }
  }

  // Reset
  $('#reset').on('click', () => {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i]) {
        filters[i].val('');
        filterColumn(i, filters[i]);
      }
    }
    getTable().draw();
  });

  // Init table
  initTable('test');
  // setTimeout(() => {
  //   getTable().destroy();
  //   initTable('test');
  // }, 1000);
}

function initTable(reportName) {
  $('#report-table').DataTable({
    ajax: {
      url: 'data/' + reportName +'.json',
      dataSrc: ( json ) => {
        for ( let i=0, end=json.data.length ; i<end ; i++ ) {
          json.data[i][6] = '<a href="'+json.data[i][6]+'" target="_blank">'+json.data[i][6]+'</a>';
        }
        $('#title').html(json.title);
        return json.data;
      }
    },
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
      'dataType': 'json',
      'success': function (data) {
        json = data;
      }
    });
    return json;
  })();
}

function filterColumn(i, elem) {
  // console.log('> filterColumn', i, elem);
  getTable().column(i).search(
    elem.val()
  ).draw();
}

function getTable() {
  return $('#report-table').DataTable();
}

$(document).ready(init);

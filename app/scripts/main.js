function init() {

  // Data source
  $('#source-select').on('change', event => {
    loadReportData(event.target.value);
  });

  // Filters
  const filters = [];
  filters[1] = $('input#authority');
  filters[2] = $('input#form');
  filters[3] = $('input#notice-title');
  filters[4] = $('input#procurement-type');
  filters[5] = $('select#framework');
  filters[6] = $('input#publication-date');
  // filters[8] = $('input#contract-item');
  // filters[9] = $('input#contract-number');
  // filters[10] = $('input#lot-id');
  filters[11] = $('input#contract-title');
  filters[13] = $('input#contractor');
  filters[14] = $('input#awarded-value');

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
  // initTable();
  loadReportData(getCurrentDataSource());
  // setTimeout(() => {
  //   loadReportData('test');
  // }, 3000);
}

function initTable() {
  $('#report-table').DataTable({
    columns: [
      {
        title: ''
      },
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
    columnDefs: [
      {
        targets: 0,
        visible: false
      },
      {
        targets: 7,
        render: (data, type, row) => {
          return '<a href="' + data + '" target="_blank">' + data + '</a>';
        }
      }
    ],
    rowsGroup: [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ],
    // rowGroup: {
    //   dataSrc: 0
    // },
    // drawCallback: function (settings) {
    //   console.log('====== drawCallback', !!$('tr.group').length);
    //   if (!!$('tr.group').length) {
    //     return;
    //   }
    //   const api = this.api();
    //   const rows = api.rows().nodes();
    //   let last = null;
    //   api.column(0).data().each(function (group, i) {
    //     console.log('>', i);
    //     if (last !== group) {
    //       console.log('before', $(rows).eq(i).before());
    //       $(rows).eq(i).before(
    //         '<tr class="group"><td colspan="15">' + group + '</td></tr>'
    //       );
    //       last = group;
    //     }
    //   });
    // },
    paging: false
  });
}

function loadReportData(sourceId) {
  console.log('> initTable', $.fn.DataTable.isDataTable('#report-table'))
  if ($.fn.DataTable.isDataTable('#report-table')) {
    getTable().clear().draw();
  }
  else {
    initTable();
  }
  $.ajax({
    url: 'data/' + sourceId + '.json',
  }).done(report => {
    // const data = report.data;
    // // $('#title').html(report.title);
    // // Format data
    // for (let i = 0, end = data.length; i < end; i++) {
    //   data[i][7] = '<a href="' + data[i][7] + '" target="_blank">' + data[i][7] + '</a>';
    // }
    getTable().rows.add(report.data);
    getTable().columns.adjust().draw();
  });
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

function getCurrentDataSource() {
  return $('#source-select').val();
}

$(document).ready(init);

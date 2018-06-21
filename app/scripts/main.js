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
  // filters[14] = $('input#awarded-value');

  for (let i = 0; i < filters.length; i++) {
    if (filters[i]) {
      ((index, elem) => {
        filters[i].on('keyup change', () => {
          filterColumn(index, elem);
        });
      })(i, filters[i]);
    }
  }
  $('input#min-value, input#max-value').on('keyup change', () => {
    getTable().draw();
  });

  // Reset
  $('#reset').on('click', () => {
    $('.filter input').val('');
    getTable().columns().search('').draw();
  });

  // Init table
  loadReportData(getCurrentDataSource());
}

function initTable() {
  $('#report-table').DataTable({
    columns: [
      {},
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
      },
      {
        targets: 14,
        render: (data, type, row) => {
          const min = row[14];
          const max = row[15];
          const currency = row[16];
          if (!min && !max) {
            return '-';
          }
          return currency + ' ' + formatAmount(min) + (min !== max ? '-' + formatAmount(max) : '');
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
  $.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
      // console.log('>>>> ', data, getTable().rows(dataIndex).data()[0]);
      const minFilter = parseFloat($('input#min-value').val());
      const maxFilter = parseFloat($('input#max-value').val());
      const row = getTable().rows(dataIndex).data()[0];
      const minValue = row[14] || 0;
      const maxValue = row[15] || 0;
      let match = true;
      if (!isNaN(minFilter)) {
        match = minValue >= minFilter;
      }
      if (match && !isNaN(maxFilter)) {
        match = maxValue <= maxFilter;
      }
      // console.log('> ['+dataIndex+']', minFilter, minValue, '/', maxFilter, maxValue, '=>', match);
      return match;
    }
  );
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

function formatAmount(value) {
  return value.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

$(document).ready(init);

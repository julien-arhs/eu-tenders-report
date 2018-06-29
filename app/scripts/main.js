function init() {

  // Data source
  const files = [
    'Agencies',
    'European Commission',
    'Publications office of the European Union'
  ];
  const sourceSelect = $('#source-select');
  for (let value of files) {
    sourceSelect.append($("<option>")
      .val(value)
      .html(value)
    );
  }
  sourceSelect.on('change', event => {
    loadReportData(event.target.value);
  });
  const amountRange = $('#amount-range');
  $('#amount-slider').slider({
    slide: function (event, ui) {
      amountRange.val(formatAmount(ui.values[0]) + " - " + formatAmount(ui.values[1]));
      getTable().draw();
    }
  });

  // Filters
  const filters = [];
  filters[1] = $('input#authority');
  // filters[2] = $('input#form');
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

  // Reset
  $('#reset').on('click', () => {
    $('.filter-input').val('');
    // Reset slider
    const minAmount = $('#amount-slider').slider('option', 'min');
    const maxAmount = $('#amount-slider').slider('option', 'max');
    setFilterRangeAmount(minAmount, maxAmount);
    getTable().columns().search('').draw();
  });

  // Init table
  loadReportData(getCurrentDataSource());
}

function initTable() {
  $('#report-table').DataTable({
    dom: 'Bptip',
    columns: [
      {},
      {
        title: 'Contracting Authority name'
      },
      {},
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
        targets: 1,
        className: 'authority'
      },
      {
        targets: 2,
        visible: false
      },
      {
        targets: 4,
        className: 'procurement'
      },
      {
        targets: 7,
        className: 'link',
        render: (data, type, row) => {
          return '<a href="' + data + '" target="_blank">' + data + '</a>';
        }
      },
      {
        targets: 14,
        type: 'amount',
        className: 'amount',
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
    /* Plugin to handle colspan (rowGroup.js), not compatible with the plugin to handle rowspan (rowsGroup)  */
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
    buttons: [
      'copyHtml5',
      'excel'
    ],
    pageLength: 20,
    paging: true
  });
  // Amount sorting
  $.extend($.fn.dataTableExt.oSort, {
    'amount-pre': function (a) {
      a = (a === '-') ? 0 : a.replace(/[^\d\-\.]/g, '');
      return parseFloat(a);
    },

    'amount-asc': function (a, b) {
      return a - b;
    },

    'amount-desc': function (a, b) {
      return b - a;
    }
  });
  // Apply filtering on amount min/max
  $.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
      // console.log('>>>> ', data, getTable().rows(dataIndex).data()[0]);
      const minFilter = getMinAmountFilter();
      const maxFilter = getMaxAmountFilter()
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
    initAmountSlider(report.data);
    getTable().rows.add(report.data);
    getTable().columns.adjust().draw();
  });
}

function initAmountSlider(data) {
  // Look for min and max amount
  let min = Infinity;
  let max = 0;
  let minValue, maxValue;
  for (let row of data) {
    minValue = row[14];
    maxValue = row[15];
    if (minValue < min) {
      min = minValue;
    }
    if (maxValue > max) {
      max = maxValue;
    }
  }
  const step = 50000;
  // Adjust max to superior step, otherwise the highest value is not included (shitty)
  max = Math.ceil(max / step) * step;
  console.log('> FACTOR', max);
  $('#amount-slider').slider({
    range: true,
    step: step,
    min: min,
    max: max
  });
  setFilterRangeAmount(min, max);
}

function setFilterRangeAmount(minValue, maxValue) {
  $('#amount-slider').slider({
    values: [minValue, maxValue]
  });
  $('#amount-range').val(formatAmount(getMinAmountFilter(minValue)) + ' - ' + formatAmount(getMaxAmountFilter(maxValue)));
}

function getMinAmountFilter() {
  return $('#amount-slider').slider('values', 0);
}

function getMaxAmountFilter() {
  return $('#amount-slider').slider('values', 1);
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

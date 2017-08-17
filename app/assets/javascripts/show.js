$(document).on('turbolinks:load', function (event) {

  console.log('javascript is running...')

  $('.social_trading.show').ready(function () {


    // to clear entries selection dropdown/info, next/prev page selector
    // otherwise will new ones will be created if user clicks browser 'back' button
    if ($('.dataTables_length')) {
      $('.dataTables_length').remove()
    }
    if ($('.dataTables_info')) {
      $('.dataTables_info').remove()
    }
    if ($('.dataTables_paginate.paging_simple')) {
      $('.dataTables_paginate.paging_simple').remove()
    }


    if (!($.fn.dataTable.isDataTable('#portfolioTable'))) {
      $('#portfolioTable').DataTable({
         searching: false,
         ordering: false,
         select: false,
         paging: false,  // **** TURN ON IF COINS NO LONGER LIMITED TO 5
         // pagingType: "simple"
      })
    }

    if (!($.fn.dataTable.isDataTable('#transactionsTable'))) {
      $('#transactionsTable').DataTable({
          searching: false,
          ordering: false,
          select: false,
          paging: true,
          pagingType: "simple"
      })
    }

    // take ruby server time and convert to user's local time
    var d = $('.dtn').data('datetimenow')
    var d_converted = new Date(d)
    var dataDate = d_converted.toISOString().slice(0, 10)
    var dataTime = d_converted.toTimeString().slice(0, 5)
    $('.overview-date-time').text('Overview (as of '+dataDate+', '+dataTime+')')

  })
})

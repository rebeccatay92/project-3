$(document).on('turbolinks:load', function (event) {  

  console.log('javascript is running...')  

  $('.social_trading.index').ready(function () {


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

    if (!($.fn.dataTable.isDataTable('#rankingsTable'))) {

     $('#rankingsTable').DataTable({
        searching: false,
        ordering: false,
        select: false,
        paging: true,
        pagingType: "simple"
      })
    }   
  })
})
$(document).on('turbolinks:load', function (event) {  

  console.log('javascript is running...')  

  $('.social_trading.index').ready(function () {

     $('#rankingsTable').DataTable({
        searching: false,
        ordering: false,
        select: false,
        paging: true,
        pagingType: "simple"
      })     
  })
})
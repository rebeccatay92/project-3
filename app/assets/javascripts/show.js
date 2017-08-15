$(document).on('turbolinks:load', function (event) {  

  console.log('javascript is running...')  

  $('.social_trading.show').ready(function () {

    $('#portfolioTable').DataTable({
       searching: false,
       ordering: false,
       select: false,
       paging: false,  // **** TURN ON IF COINS NO LONGER LIMITED TO 5
       // pagingType: "simple"
    })

    $('#transactionsTable').DataTable({
        searching: false,
        ordering: false,
        select: false,
        paging: true,
        pagingType: "simple"
    })    
  })
})
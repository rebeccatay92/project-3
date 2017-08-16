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

    // take ruby server time and convert to user's local time
    var d = $('.dtn').data('datetimenow') 
    var d_converted = new Date(d)
    var dataDate = d_converted.toISOString().slice(0, 10)
    var dataTime = d_converted.toTimeString().slice(0, 5)
    $('.overview-date-time').text('Overview (as of '+dataDate+', '+dataTime+')')

  })
})


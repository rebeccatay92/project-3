$(document).on('turbolinks:load', function (event) {
  console.log('javascript is running...')

  // sell curency
  $('.portfolios.index').ready(function () {

    $('.sell_currency').on('keyup', '.text_field', function(e) {
      console.log(e)
      // console.log(e.target.value)
      var units = e.target.value
      // console.log($(this).parent().parent().children("ticker"))
      var ticker = $(this).parent().parent().children("ticker")
      // console.log(ticker.children().children(".ticker-dollars")[0].innerText)
      var cryptoprice = ticker.children().children(".ticker-dollars")[0].innerText
      var trxprice = (units*cryptoprice).toFixed(2)

      console.log($(this).parent().children("#cost"))
      var value_node = $(this).parent().children("#cost")
      value_node.text("Transaction value: $" + trxprice)
    })


    // buy curency
  $('#trade-section .text_field').on('keyup', function(e){
    // console.log($(this).parent().children('.buyprice')[0].value);
    var cryptoprice = $(this).parent().children('.buyprice')[0].value
    var units = e.target.value
    var trxprice = (units*cryptoprice).toFixed(2)

    var value_node = $(this).parent().children("#cost")
    value_node.text("Transaction value: $" + trxprice)

})

  })
})

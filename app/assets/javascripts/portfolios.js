$(document).on('turbolinks:load', function (event) {
  console.log('javascript is running...')

  $('.portfolios.index').ready(function () {

$('.sell_currency').on('keyup', '.text_field' , function(e){
// console.log(e.target.value);
var units = e.target.value
// console.log($(this).parent().parent().children('.sell_price')[0].innerText);
var priceNode = $(this).parent().parent().children('.sell_price')[0]
console.log(priceNode);
var priceString = priceNode.innerText
var price = priceString.split('$')[1]
console.log('price is ' + price + 'and there are ' + units + 'units')
var transaction_node = $(this).parent().children('#cost')
transaction_node.text('Transaction value:  US$'+(price*units).toFixed(2))

})

$('.buy_currency .text_field').on('keyup', function(e){
console.log(e.target.value);

var units = e.target.value
// console.log($(this).parent().parent().children('.buy_price')[0].innerText);
var priceNode = $(this).parent().parent().children('.buy_price')[0]
var priceString = priceNode.innerText
var price = priceString.split('$')[1]
console.log('price is ' + price + 'and there are ' + units + 'units')
var transaction_node = $(this).parent().children('#cost')
transaction_node.text('Transaction value:  US$'+(price*units).toFixed(2))

})
  //   function refresh() {
  //     location.reload()
  //   }
  //   setInterval(refresh, 5000)
  //
  })
})

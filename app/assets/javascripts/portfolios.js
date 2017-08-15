$(document).on('turbolinks:load', function (event) {
  console.log('javascript is running...')

  $('.portfolios.index').ready(function () {

    function refresh() {
      location.reload()
    }
    setInterval(refresh, 5000)

  })
})

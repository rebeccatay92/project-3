$(document).on('turbolinks:load', function (event) {
  console.log('javascript is running...')

  $('.portfolios.index').ready(function () {

    function refresh() {
      location.reload()
    }

    clearInterval(refresh)
    setInterval(refresh, 10000)

  })
})

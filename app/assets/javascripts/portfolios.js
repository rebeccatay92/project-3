$(document).on('turbolinks:load', function (event) {
  console.log('javascript is running...')

  $('.portfolios.index').ready(function () {
    var timerId

    function refresh () {
      if ($('.portfolios.index').length) {
        console.log('reload')
        location.reload()
      }
    }

    clearInterval(timerId)
    timerId = setInterval(refresh, 10000)
  })
})

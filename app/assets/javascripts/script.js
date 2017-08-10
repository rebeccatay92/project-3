$(document).on('ready page:load', function (event) {
  console.log('javascript is running...')
  /* ------------------------------------------------ */
  var currencySym = 'BTC'
  var timeDigit = 60
  var timeFrame = 'minute'
  var bufferPeriods = 50
  var indicator1data = []
  var indicator2data = []
  /* ------------------------------------------------ */
  // update chart based on selection changes
  $('button').on('click', function () {
    // console.log($(':selected'))
    dataArr = []
    currencySym = $(':selected')[0].id
    timeDigit = $(':selected')[1].id
    timeFrame = $(':selected')[1].className
    indicator1 = $(':selected')[2].id
    indicator2 = $(':selected')[3].id
    indicator3 = $(':selected')[4].id
    // which api to call. min/hr/day

    totalTimePeriods = parseInt(timeDigit) + bufferPeriods - 1
    var histoQuery = `https://min-api.cryptocompare.com/data/histo${timeFrame}?tsym=USD&fsym=${currencySym}&limit=${totalTimePeriods}`

    $.get(histoQuery).done(function (x) {
      apidata = x.Data

      // for prices remove day -50 to 0
      close = JSON.parse(JSON.stringify(apidata)).splice(50)
      close.forEach(function (e) {
        e.time = new Date(e.time * 1000)
        e.value = e.close
      })
      // always chart the price
      dataArr.push(close)

      if (indicator1) {
        var periods = indicator1.substring(3)
        sma = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < sma.length; i++) {
          var periodsArr = sma.slice(i - periods, i)
          // var sum = periodsArr.reduce(function(a,b) {
          //   return {close: (a.close + b.close)}
          // })
          // var avg = sum.close/periods
          var avg = averageClose(periodsArr)
          sma[i].value = avg
          sma[i].time = new Date(sma[i].time * 1000)
        }
        indicator1data = sma.splice(50)
        dataArr.push(indicator1data)
      }

      if (indicator2) {
        var periods = indicator2.substring(3)
        sma = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < sma.length; i++) {
          var periodsArr = sma.slice(i - periods, i)
          // var sum = periodsArr.reduce(function(a,b) {
          //   return {close: (a.close + b.close)}
          // })
          // var avg = sum.close/periods
          var avg = averageClose(periodsArr)
          sma[i].value = avg
          sma[i].time = new Date(sma[i].time * 1000)
        }
        indicator2data = sma.splice(50)
        dataArr.push(indicator2data)
      }

      if (indicator3) {
        var bollingerLower = JSON.parse(JSON.stringify(apidata)).splice(0)
        var bollingerUpper = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < bollingerLower.length; i++) {
          var periodsArr = bollingerLower.slice(i - 20, i)
          var avg = averageClose(periodsArr)
          var stdDev = standardDeviation(periodsArr)

          bollingerLower[i].value = avg - 2 * stdDev
          bollingerLower[i].time = new Date(bollingerLower[i].time * 1000)

          bollingerUpper[i].value = avg + 2 * stdDev
          bollingerUpper[i].time = new Date(bollingerUpper[i].time * 1000)
        }
        indicator3upper = bollingerUpper.splice(50)
        indicator3lower = bollingerLower.splice(50)
        dataArr.push(indicator3lower, indicator3upper)
      }

      plot()

      volume = JSON.parse(JSON.stringify(apidata)).splice(50)
      volume.forEach(function (e) {
        e.time = new Date(e.time * 1000)
        e.value = e.volumeto
      })
      plotVolume()
    })
  })

  /* ------------------------------------------------ */
  function plot () {
    // finding min.max value for y axis
    closeSort = close.sort(function (a, b) {
      return a.value - b.value
    })
    // console.log(closeSort)

    MG.data_graphic({
      // title: 'Historical Price',
      // description: 'Closing',
      data: dataArr,
      width: 1000,
      height: 500,
      target: '#graph',
      x_accessor: 'time',
      y_accessor: 'value',
      x_label: 'Time',
      y_label: 'USD',
      yax_format: d3.format('2'),
      min_y: closeSort[0].value,
      // sets axis min
      max_y: closeSort[closeSort.length - 1].value,
      area: false,
      aggregate_rollover: true
    })
  }

  function plotVolume () {
    MG.data_graphic({
      // title: 'Historical Price',
      // description: 'Closing',
      data: [volume],
      chart_type: 'histogram',
      binned: true,
      width: 1000,
      height: 200,
      target: '#volume',
      x_accessor: 'time',
      y_accessor: 'value',
      x_label: 'Time',
      y_label: 'Volume',
      // yax_format: d3.format('2'),
      min_y_from_data: true,
      // min_y: volumeSort[0].value,
      // sets axis min
      // max_y: volumeSort[volumeSort.length - 1].value,
      aggregate_rollover: true
    })
  }

  function standardDeviation (arrOfObjs) {
    var avg = averageClose(arrOfObjs)
    var sqDiff = []
    arrOfObjs.forEach(function (e) {
      var diff = e.close - avg
      sqDiff.push(diff * diff)
    })
    var sumSqDiff = sqDiff.reduce(function (a, b) {
      return a + b
    })
    var avgSqDiff = sumSqDiff / 20
    var stdDev = Math.sqrt(avgSqDiff)
    return stdDev
  }

// finding avg in array of objects (closing price)
  function averageClose (arrOfObjs) {
    var sum = arrOfObjs.reduce(function (a, b) {
      return {close: (a.close + b.close)}
    })
    var avg = sum.close / arrOfObjs.length
    return avg
  }
  /* ------------------------------------------------ */
  var currentPriceApi = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,DASH&tsyms=USD`

  function getCurrentPrice () {
    $.get(currentPriceApi).done(function (data) {
      // console.log(data)
      for (var key in data) {
        // console.log(key) //coin symbol
        // console.log(data[key].USD) //price
        $(`#live${key}`).text(`${key}: ${data[key].USD}`)
      }
    }) // close api call
  } // close fn
  getCurrentPrice()
  setInterval(getCurrentPrice, 10000)
  /* ------------------------------------------------ */
}) // close doc.ready

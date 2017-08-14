$(document).on('ready page:load', function (event) {
  console.log('javascript is running...')
  /* ------------------------------------------------ */
  var bufferPeriods = 50
  /* ------------------------------------------------ */
  // update chart based on selection changes
  $('select').on('change', function () {
    // console.log($(':selected'))
    dataArr = []
    legendArr = []
    currencySym = $(':selected')[0].id
    timeDigit = parseInt($(':selected')[1].id)
    timeFrame = $(':selected')[1].className
    indicator1 = $(':selected')[2].id
    indicator2 = $(':selected')[3].id
    indicator3 = $(':selected')[4].id

    if (!currencySym) return

    totalTimePeriods = timeDigit + bufferPeriods - 1
    var histoQuery = `https://min-api.cryptocompare.com/data/histo${timeFrame}?tsym=USD&fsym=${currencySym}&limit=${totalTimePeriods}`

    $.get(histoQuery).done(function (x) {
      apidata = x.Data

      // deep clone the array of objects
      // for prices remove day -50 to 0 (for calculating avgs)
      close = JSON.parse(JSON.stringify(apidata)).splice(50)
      close.forEach(function (e) {
        e.value = e.close
      })
      dataArr.push(close)
      legendArr.push('Close')

      volume = JSON.parse(JSON.stringify(apidata)).splice(50)
      volume.forEach(function (e) {
        e.value = e.volumefrom
      })
      plotVolume()

      if (indicator1) {
        var indicator1data = movingAvgs(indicator1)
        dataArr.push(indicator1data)
        legendArr.push(indicator1)
      }

      if (indicator2) {
        var indicator2data = movingAvgs(indicator2)
        dataArr.push(indicator2data)
        legendArr.push(indicator2)
      }

      if (indicator3) {
        var bollingerLower = JSON.parse(JSON.stringify(apidata)).splice(0)
        var bollingerUpper = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < bollingerLower.length; i++) {
          var periodsArr = bollingerLower.slice(i - 20, i)
          var avg = averageClose(periodsArr)
          var stdDev = standardDeviation(periodsArr)

          if (indicator3 === 'BB(20,2)') {
            bollingerLower[i].value = avg - 2 * stdDev
            bollingerUpper[i].value = avg + 2 * stdDev
          } else {
            bollingerLower[i].value = avg - 2.5 * stdDev
            bollingerUpper[i].value = avg + 2.5 * stdDev
          }
        }
        indicator3upper = bollingerUpper.splice(50)
        indicator3lower = bollingerLower.splice(50)
        dataArr.push(indicator3lower, indicator3upper)
        legendArr.push('Lower Bound', 'Upper Bound')
      }

      plot()
    })
  })

  /* ------------------------------------------------ */

  function movingAvgs (indicator) {
    var periods = parseInt(indicator.substring(3))
    var type = indicator.substring(0, 3)
    sma = JSON.parse(JSON.stringify(apidata)).splice(0)
    ema = JSON.parse(JSON.stringify(apidata)).splice(0)

    for (i = 50; i < sma.length; i++) {
      var periodsArr = sma.slice(i - periods, i)
      var avg = averageClose(periodsArr)
      sma[i].value = avg
    }

    if (type === 'SMA') {
      indicatordata = sma.splice(50)
    } else {
      ema[50].value = sma[50].value
      var multiplier = 2 / (periods + 1)
        // ema formula, where starting ema[50] = sma value
      for (i = 51; i < ema.length; i++) {
        ema[i].value = (ema[i].close - ema[i - 1].value) * multiplier + ema[i - 1].value
      }
      indicatordata = ema.splice(50)
    }

    return indicatordata
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
    var avgSqDiff = sumSqDiff / arrOfObjs.length
    var stdDev = Math.sqrt(avgSqDiff)
    return stdDev
  }

  function averageClose (arrOfObjs) {
    var sum = arrOfObjs.reduce(function (a, b) {
      return {close: (a.close + b.close)}
    })
    var avg = sum.close / arrOfObjs.length
    return avg
  }

  function plot () {
    var maxValues = []
    dataArr.forEach(function (arrOfObjs) {
      arrOfObjs.forEach(function (e) {
        e.time = new Date(e.time * 1000)
      })
      arrOfObjs.sort(function (a, b) {
        return b.value - a.value
      })
      maxValues.push(arrOfObjs[0].value) //pushing max for each line
    })
    maxValues.sort(function (a, b) {
      return b - a
    })
    var maxY = maxValues[0] //finding max of all lines

    MG.data_graphic({
      data: dataArr,
      width: 1000,
      height: 500,
      right: 100,
      target: '#graph',
      x_accessor: 'time',
      y_accessor: 'value',
      x_label: 'Time',
      y_label: 'USD',
      yax_format: d3.format('2'),
      yax_count: 5,
      y_extended_ticks: true,
      min_y_from_data: true,
      max_y: maxY,
      legend: legendArr,
      aggregate_rollover: true,
      decimals: 4
    })
  }

  function plotVolume () {
    volume.forEach(function (e) {
      e.time = new Date(e.time * 1000)
    })

    MG.data_graphic({
      data: volume,
      chart_type: 'histogram',
      binned: true,
      width: 1000,
      height: 200,
      right: 100,
      target: '#volume',
      x_accessor: 'time',
      y_accessor: 'value',
      x_label: 'Time',
      y_label: 'Volume'
    })
  }

  /* ------------------------------------------------ */
  var currentPriceApi = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,DASH&tsyms=USD`

  function getCurrentPrice () {
    $.get(currentPriceApi).done(function (data) {
      for (var key in data) {
        $(`#live${key}`).text(`${key}: ${data[key].USD}`)
      }
    })
  }

  getCurrentPrice()

  setInterval(getCurrentPrice, 10000)
  /* ------------------------------------------------ */
}) // close doc.ready

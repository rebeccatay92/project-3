$(document).on('ready page:load', function(event) {
  console.log('javascript is running...')
  /*------------------------------------------------*/
  var currencySym = 'BTC'
  var timeDigit = 60
  var timeFrame = 'minute'
  var bufferPeriods = 50
  var dataArr = []
  var indicator1 = ''
  var indicator1data = []
  var indicator2 = ''
  var indicator2data = []
  /*------------------------------------------------*/
  // update chart based on selection changes
  $('select').change(function() {
    currencySym = $(':selected')[0].id
    timeDigit = $(':selected')[1].id
    timeFrame = $(':selected')[1].className
    indicator1 = $(':selected')[2].id
    indicator2 = $(':selected')[3].id
    //which api to call. min/hr/day
    // console.log($(':selected'))
    // console.log(indicator1)
    totalTimePeriods = parseInt(timeDigit) + bufferPeriods - 1
    var histoQuery =`https://min-api.cryptocompare.com/data/histo${timeFrame}?tsym=USD&fsym=${currencySym}&limit=${totalTimePeriods}`

    $.get(histoQuery).done(function(x) {
      apidata = x.Data

      // for prices remove day -50 to 0
      close = JSON.parse(JSON.stringify(apidata)).splice(50)
      close.forEach(function(e) {
        e.time =  new Date(e.time * 1000)
        e.value = e.close
      })
      //always chart the price
      dataArr = [close]

      if (indicator1 === 'SMA5') {
        sma5 = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < sma5.length; i++) {
          var arr5days = sma5.slice(i-5,i)
          var sum = arr5days.reduce(function(a,b) {
            return {close: (a.close + b.close)}
          })
          var avg = sum.close/5
          sma5[i].value = avg
          sma5[i].time = new Date(sma5[i].time * 1000)
        }
        indicator1data = sma5.splice(50)
        dataArr[1] = indicator1data
      } else if (indicator1 === 'SMA20') {
        sma20 = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < sma20.length; i++) {
          var arr20days = sma20.slice(i-20,i)
          var sum = arr20days.reduce(function(a,b) {
            return {close: (a.close + b.close)}
          })
          var avg = sum.close/20
          sma20[i].value = avg
          sma20[i].time = new Date(sma20[i].time * 1000)
        }
        indicator1data = sma20.splice(50)
        dataArr[1] = indicator1data
      } else if (indicator1 === 'SMA50') {
        sma50 = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < sma50.length; i++) {
          var arr50days = sma50.slice(i-50,i)
          var sum = arr50days.reduce(function(a,b) {
            return {close: (a.close + b.close)}
          })
          var avg = sum.close/50
          sma50[i].value = avg
          sma50[i].time = new Date(sma50[i].time * 1000)
        }
        indicator1data = sma50.splice(50)
        console.log(indicator1data)
        dataArr[1] = indicator1data
      } else {
        indicator1data = []
        dataArr.splice(1,1) //removes indicator1 line
      }

      if (indicator2 === 'SMA5') {
        sma5 = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < sma5.length; i++) {
          var arr5days = sma5.slice(i-5,i)
          var sum = arr5days.reduce(function(a,b) {
            return {close: (a.close + b.close)}
          })
          var avg = sum.close/5
          sma5[i].value = avg
          sma5[i].time = new Date(sma5[i].time * 1000)
        }
        indicator2data = sma5.splice(50)
        dataArr[2] = indicator2data
      } else if (indicator2 === 'SMA20') {
        sma20 = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < sma20.length; i++) {
          var arr20days = sma20.slice(i-20,i)
          var sum = arr20days.reduce(function(a,b) {
            return {close: (a.close + b.close)}
          })
          var avg = sum.close/20
          sma20[i].value = avg
          sma20[i].time = new Date(sma20[i].time * 1000)
        }
        indicator2data = sma20.splice(50)
        dataArr[2] = indicator2data
        console.log(indicator2data)
      } else if (indicator2 === 'SMA50') {
        sma50 = JSON.parse(JSON.stringify(apidata)).splice(0)
        for (i = 50; i < sma50.length; i++) {
          var arr50days = sma50.slice(i-50,i)
          var sum = arr50days.reduce(function(a,b) {
            return {close: (a.close + b.close)}
          })
          var avg = sum.close/50
          sma50[i].value = avg
          sma50[i].time = new Date(sma50[i].time * 1000)
        }
        indicator2data = sma50.splice(50)
        dataArr[2] = indicator2data
      } else {
        indicator2data = []
        dataArr.splice(2,1) //removes indicator1 line
      }

      // console.log(dataArr)
      plot()

      // volume = JSON.parse(JSON.stringify(apidata)).splice(20)
      // volume.forEach(function(e) {
      //   e.time =  new Date(e.time * 1000)
      //   e.value = e.volumeto
      // })
      // console.log(volume)
      // plotVolume()
    })
  })

  /*------------------------------------------------*/
  function plot() {
    // finding min.max value for y axis
    closeSort = close.sort(function(a,b) {
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
      //sets axis min
      max_y: closeSort[closeSort.length - 1].value,
      area: false,
      aggregate_rollover: true
    })
  }

  function plotVolume() {
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
      //sets axis min
      // max_y: volumeSort[volumeSort.length - 1].value,
      aggregate_rollover: true
    })
  }
  /*------------------------------------------------*/
  var currentPriceApi = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,DASH&tsyms=USD`

  function getCurrentPrice(){
    $.get(currentPriceApi).done(function(data){
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
  /*------------------------------------------------*/
}) //close doc.ready

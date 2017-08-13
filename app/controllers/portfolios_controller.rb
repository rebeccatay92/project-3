class PortfoliosController < ApplicationController


  def index
    current_price_url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,DASH&tsyms=USD'

      price = HTTParty.get(current_price_url)

      # setInterval(2)

@priceBTC= price["BTC"]["USD"]

@priceETH= price["ETH"]["USD"]

@priceXRP= price["XRP"]["USD"]

@priceLTC= price["LTC"]["USD"]

@priceDASH= price["DASH"]["USD"]

@new_transaction = Transaction.new


end

def create

render json :params



end






end


# def setInterval(delay)
# Thread.new do
# loop do
# sleep delay
# current_price_url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,DASH&tsyms=USD'
#
#   price = HTTParty.get(current_price_url)
#   puts price
#
# end
#
# end

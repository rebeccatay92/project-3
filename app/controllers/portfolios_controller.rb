class PortfoliosController < ApplicationController

  def index
    current_price_url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,DASH&tsyms=USD'
      @price = HTTParty.get(current_price_url)
      # setInterval(2)

@priceBTC= @price["BTC"]["USD"]

@priceETH= @price["ETH"]["USD"]

@priceXRP= @price["XRP"]["USD"]

@priceLTC= @price["LTC"]["USD"]

@priceDASH= @price["DASH"]["USD"]

@new_transaction = Transaction.new
@all_currencies = Currency.all
@user_portfolio = Portfolio.where(user_id: current_user)



@hash_portfolios = []

@price.each_with_index do | price, index |
  if @user_portfolio[index]
    @hash_portfolios << price[1]['USD'] * @user_portfolio[index][:total_units]
  end

end

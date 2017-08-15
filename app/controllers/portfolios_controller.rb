class PortfoliosController < ApplicationController

  def index
    current_price_url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,DASH&tsyms=USD'
    @price = HTTParty.get(current_price_url)
    @priceBTC= @price["BTC"]["USD"]
    @priceETH= @price["ETH"]["USD"]
    @priceXRP= @price["XRP"]["USD"]
    @priceLTC= @price["LTC"]["USD"]
    @priceDASH= @price["DASH"]["USD"]

    @new_transaction = Transaction.new
    @all_currencies = Currency.all
    @user_portfolio = Portfolio.where(user_id: current_user)

    @currencyIDs = []
    @symbols = []
    @unit_price = []
    @portfolio_value = []
    @user_portfolio.each do |portfolio|
      thiscurrencyid = portfolio[:currency_id]
      @currencyIDs << thiscurrencyid
      thiscurrency = Currency.find(thiscurrencyid)
      thissymbol = thiscurrency[:currency_symbol].to_s
      @symbols << thissymbol
      unitprice = @price[thissymbol]["USD"]

      @unit_price << unitprice
      @portfolio_value << unitprice * portfolio[:total_units]
    end


    # render json: {
    #   :user_portfolio => @user_portfolio,
    #   :price => @price,
    #   :currencyarray => @currencyIDs,
    #   :symbols => @symbols,
    #   :unitprices => @unitprices,
    #   :portfolio_value => @portfolio_value
    # }

  end #close def
end #close controller

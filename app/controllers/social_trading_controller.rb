class SocialTradingController < ApplicationController

require 'date'

  def index
    #code
    today = Date.today
    date_90days_ago = today - 90
    dt_date_90days_ago = date_90days_ago.to_datetime


    # p today.to_datetime
    # p date_90days_ago

    # Transactions.where(created_at: (Time.now.midnight - 1.day)..Time.now.midnight)

    all_past90days_transactions = Transaction.where(created_at: dt_date_90days_ago..today)

    # all_past90days_transactions.each do |record|
    #   p record
    # end

    txn_count = Transaction.group(:user_id).count
    # p txn_count.values
    #
    sorted = (txn_count.sort_by { |a, b| b}).reverse
    # p sorted

    @active_trader_list = []

    sorted.each do |most_active_trader|
      # print "user name:"
      # p User.find(most_active_trader[0]).name
      # print "number of trades"
      # p most_active_trader[1]
      @active_trader_list.push({
        user_name: User.find(most_active_trader[0]).name,
        user_id: most_active_trader[0],
        trades: most_active_trader[1]
      })


    end

    #p @active_trader_list.inspect

    @active_from = date_90days_ago
    @active_to = today


  end

  def show
    # render html: "show active trader ID: #{params}" #{params[:id]}
    arr = params[:id].split("+")
    # render html: "aaa #{aaa}; bbb #{bbb}"
    @active_trader = User.find(arr[0])
    @trader_ranking = arr[1]
    


    ##############################
    ### get lastest coins prices
    ##############################

    current_price_url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,DASH&tsyms=USD'

    price = HTTParty.get(current_price_url)
    # priceBTC= price["BTC"]["USD"]
    # priceETH= price["ETH"]["USD"]
    # priceXRP= price["XRP"]["USD"]
    # priceLTC= price["LTC"]["USD"]
    # priceDASH= price["DASH"]["USD"]

    t = Time.now
    @date_now = t.strftime('%F')
    @time_now = t.strftime('%R')

    all_portfolios = Portfolio.where(user_id: arr[0])
    @user_portfolios = []
    @total_portfolio_value = 0

    all_portfolios.each do |portfolio|
      pot = []
      currency_name = Currency.where(id: portfolio[:currency_id])[0][:currency_symbol]
      portfolio_value = (portfolio[:total_units] *  price[currency_name]["USD"])
      pot.push(currency_name)
      pot.push('%.2f' % portfolio[:total_units])
      pot.push('%.2f' % portfolio_value)
      @user_portfolios.push(pot)
      @total_portfolio_value += portfolio_value
    end

    @credit_remaining = @active_trader.credits_remaining
    @total_account_value = '%.2f' %(@credit_remaining + @total_portfolio_value)
    @credit_remaining = '%.2f' %(@active_trader.credits_remaining)

    today = Date.today
    date_90days_ago = today - 90
    dt_date_90days_ago = date_90days_ago.to_datetime

    all_past90days_transactions = Transaction.where(created_at: dt_date_90days_ago..today, user_id: arr[0])

    @all_past90days_transactions = []
    all_past90days_transactions.each do |transaction|
      txn = []

      if (transaction[:txn_type] == 1)
        txn.push("Buy")
      else
        txn.push("Sell")
      end

      currency_name = Currency.where(id: transaction[:currency_id])[0][:name]
      txn.push(currency_name)
      # txn.push(transaction[:currency_id])

      txn.push(transaction[:units])

      unit_price = transaction[:amount_unit]/transaction[:units]

      txn.push('%.2f' % unit_price)
      txn.push(transaction[:created_at].to_date)
      @all_past90days_transactions.push(txn)
    end
    @all_past90days_transactions = @all_past90days_transactions.reverse
  end

end

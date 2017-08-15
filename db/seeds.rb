# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#################################################################

# 100.times do
#   User.create!(
#     :name => Faker::Name.name,
#     :email => Faker::Internet.email,
#     :password => '123456', #doesn't work if I use 'encrypted_password'
#     :credits_remaining => 50000
#   )
# end


# https://stackoverflow.com/questions/2410639/best-way-to-create-random-datetime-in-rails

# def rand_int(from, to)
#   rand_in_range(from, to).to_i
# end
#
# def rand_price(from, to)
#   rand_in_range(from, to).round(2)
# end
#
# def rand_time(from, to=Time.now)
#   Time.at(rand_in_range(from.to_f, to.to_f))
# end
#
# def rand_in_range(from, to)
#   rand * (to - from) + from
# end

# BTC_July_Time_Series = []
# ETH_July_Time_Series = []
# XRP_July_Time_Series
# LTC_July_Time_Series
# DASH_July_Time_Series

#################################
# SEED CURRENCY TABLE
#################################
# Currency.create!(
#   :name => 'BTC'
# )
#
# Currency.create!(
#   :name => 'ETH'
# )


#################################
# SEED PORTFOLIO TABLE
#################################

# User.all.each do |user|
#   Portfolio.create(
#     user_id: user.id,
#     currency_id: 1,
#     total_units: 0
#   )
#   Portfolio.create(
#     user_id: user.id,
#     currency_id: 2,
#     total_units: 0
#   )
# end

# create_table "portfolios", force: :cascade do |t|
#   t.bigint "user_id"
#   t.bigint "currency_id"
#   t.decimal "total_units"
#   t.datetime "created_at", null: false
#   t.datetime "updated_at", null: false
#   t.index ["currency_id"], name: "index_portfolios_on_currency_id"
#   t.index ["user_id"], name: "index_portfolios_on_user_id"
# end





#################################
# SEED PORTFOLIO, TRANSACTIONS
#################################
#
# Get bitcoin prices for July, source: Quandl
require "json"
file = File.read "./db/seeding/btc_july_2017.json"
data = JSON.parse(file)['dataset']['data']

# custom class to store date / price of coin
class TS
  attr_accessor :series

  def length
	   @series.length
  end

  def initialize
    @series = []
  end

  def add_data_point(date, price)
    @series.push({date: date, price: price})
  end

  def show_series
    @series
  end

  def get_price(pos)
    @series[pos][:price]
  end

  def get_date(pos)
    @series[pos][:date]
  end

  def set_price(pos, new_price)
    @series[pos][:price] = new_price
  end
end

# Simulate bitcoin series
BTC = TS.new
d = 0

# get only July prices/dates
40.downto(10) do |i|
  d += 1
  BTC.add_data_point(Time.new(2017, 7, d), data[i][4])
end

# Simulate ETH prices
ETH = TS.new
d = 0

40.downto(10) do |i|
  d += 1
  ETH.add_data_point(Time.new(2017, 7, d), data[i][4]/13)
end

# assumes user begin month with zero holdings and full credits
# assumes number of units transacted always = 1

# final portfolio value
# final_portfolio_value = credits_remaining + coin_portfolio[0] * BTC.get_price(30) + coin_portfolio[1] * ETH.get_price(30)


# #######
# Generate transactions and portfolio updates for each user
# #######

User.all.each do |user|

  credits_remaining = user.credits_remaining
  units_transacted = 1
  coin_portfolio = [0, 0] # BTC, ETH, (to extend XRP, LTC, DASH)

  0.upto(30) do |i|  # index of July 1 to 31
    # 0=no action; 1=buy; 2=sell
    action = [0,0,0,1,0,0,0,2].sample
    coin = [1,2].sample

    # print "xxxxxxxxx VALUE OF I:"
    # p i
    # print "xxxxxxxxxxxxxxxxxxxxx"

    if (action != 0)

      # determine which coin transacted and price to retrieve
      if (coin == 1) # BTC
        coinS = "BTC"
        transaction_price = BTC.get_price(i)
        transaction_date = BTC.get_date(i)
      elsif (coin == 2) # ETH
        coinS = "ETH"
        transaction_price = ETH.get_price(i)
        transaction_date = ETH.get_date(i)
      end

      if (action == 1) # Buy

        if (transaction_price <= credits_remaining) #works b'cos transact unit = 1

          credits_remaining -= transaction_price
          coin_portfolio[coin-1] += 1

          Transaction.create(
            user_id: user.id,
            currency_id: coin,
            txn_type: 1,
            units: 1,
            amount_unit: transaction_price * units_transacted,   #assumed as transaction amount
            created_at: transaction_date
          )


          # create_table "transactions", force: :cascade do |t|
          #   t.bigint "user_id"
          #   t.bigint "currency_id"
          #   t.integer "type"
          #   t.decimal "units"
          #   t.decimal "amount_unit"
          #   t.datetime "created_at", null: false
          #   t.datetime "updated_at", null: false
          #   t.index ["currency_id"], name: "index_transactions_on_currency_id"
          #   t.index ["user_id"], name: "index_transactions_on_user_id"
          # end


          user.update(credits_remaining: credits_remaining)

          # print "user_id"
          # p user.id
          # print "currency_id"
          # p coin

          update_target_Portfolio = Portfolio.find_by(user_id: user.id, currency_id: coin)
          update_target_Portfolio.update(total_units: coin_portfolio[coin-1])

        end

      elsif (action == 2) # Sell

        if (coin_portfolio[coin-1] > 0)

          credits_remaining += transaction_price
          coin_portfolio[coin-1] -= 1

          Transaction.create(
            user_id: user.id,
            currency_id: coin,
            txn_type: 2,
            units: 1,
            amount_unit: transaction_price * units_transacted,
            created_at: transaction_date
          )

          # print "user_id"
          # p user.id
          # print "currency_id"
          # p coin

          user.update(credits_remaining: credits_remaining)
          update_target_Portfolio = Portfolio.find_by(user_id: user.id, currency_id: coin)
          update_target_Portfolio.update(total_units: coin_portfolio[coin-1])
        end
      end # if (action == 1 || 2)
    end # if (action != 0)
  end # 1.upto(31) do |i|
end # User.each do |user|

###############
## REBECCA'S SEEDING
###############

# Currency.create(name:"Bitcoin", currency_symbol:"BTC")
# Currency.create(name:"Ethereum", currency_symbol:"ETH")
# Currency.create(name:"Ripple", currency_symbol:"XRP")
# Currency.create(name:"Litecoin", currency_symbol:"LTC")
# Currency.create(name:"Dash", currency_symbol:"DASH")

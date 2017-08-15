class TransactionsController < ApplicationController


def create
  # render json: params

new_transaction = Transaction.new
  new_transaction.user_id = current_user[:id]
  new_transaction.currency_id = params[:transaction][:currency_id]
  new_transaction.txn_type = params[:transaction][:txn_type]
  new_transaction.units = params[:transaction][:units]
  new_transaction.amount_unit = params[:transaction][:amount_unit]
  new_transaction.txn_amt = new_transaction.units* new_transaction.amount_unit
  new_transaction.save!


  if new_transaction.id
    if new_transaction.txn_type == 1

      current_user.credits_remaining = current_user.credits_remaining - new_transaction.txn_amt
      current_user.save

      spec_portfolio = Portfolio.where(user_id: new_transaction.user_id, currency_id: new_transaction.currency_id)

      # puts spec_portfolio.length
        if spec_portfolio.length == 0

        new_portfolio = Portfolio.new
        new_portfolio.user_id = new_transaction.user_id
        new_portfolio.currency_id = new_transaction.currency_id
        new_portfolio.total_units = new_transaction.units

        new_portfolio.save!

        else
        update_portfolio = Portfolio.find_by(user_id: new_transaction.user_id, currency_id: new_transaction.currency_id)

        update_portfolio.total_units = update_portfolio.total_units + new_transaction.units

        update_portfolio.save

        #code
      end

  elsif new_transaction.txn_type == 2
      #code
      current_user.credits_remaining = current_user.credits_remaining + new_transaction.txn_amt
      current_user.save

      update_portfolio = Portfolio.find_by(user_id: new_transaction.user_id, currency_id: new_transaction.currency_id)

      update_portfolio.total_units = update_portfolio.total_units - new_transaction.units

      update_portfolio.save

      if update_portfolio.total_units == 0
        update_portfolio.destroy

      end


      # spec_portfolio = Portfolio.where(user_id: new_transaction.user_id, currency_id: new_transaction.currency_id)
        redirect_to portfolios_path
    end

    end

  end

  end

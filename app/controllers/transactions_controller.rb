class TransactionsController < ApplicationController


def create
  render json: params[:transaction][:currency_id]


  # new_transaction.txn_type = 'Buy'
  # new_transaction.units = 2
  # new_transaction.amount_unit = params[:transaction][:amount_unit]

# new_transaction = Transaction.new
#   new_transaction.user_id = current_user[:id]
#   new_transaction.currency_id = params[:transaction][:currency_id]
#   new_transaction.txn_type = 1
#   new_transaction.units = params[:transaction][:units]
#   new_transaction.amount_unit = params[:transaction][:amount_unit]
#
#   new_transaction.save

  a = Transaction.new
  a.user_id = 1
  a.save
  puts a.inspect
#
#   puts new_transaction.inspect





  # redirect_to portfolios_path

end


end

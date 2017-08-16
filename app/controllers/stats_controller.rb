
class StatsController < ApplicationController

def index
@profitbuy = '%.2f' % (Transaction.where(txn_type: 1).sum(:txn_amt)/101)

@profitsell = '%.2f' % (Transaction.where(txn_type: 2).sum(:txn_amt)/99)

@buytransactions = Transaction.where(txn_type: 1).count

@selltransactions = Transaction.where(txn_type: 2).count

@total_users = User.count

@latest_transaction = Transaction.last

@most_transacted_id = Transaction.group('currency_id').order('currency_id').limit(1).pluck(:currency_id).first





@most_transacted = Currency.find_by(id: @most_transacted_id )

totalTransactions = Transaction.count.to_f
transactions_most_no = Transaction.where(currency_id: @most_transacted_id ).count.to_f

@percent_trades_highest = (transactions_most_no/ totalTransactions) *100

# pluck(:currency_id).first

 puts @most_transacted


end



end

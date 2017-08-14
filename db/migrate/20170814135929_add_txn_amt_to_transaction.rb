class AddTxnAmtToTransaction < ActiveRecord::Migration[5.1]
  def change
    add_column :transactions, :txn_amt, :decimal
  end
end

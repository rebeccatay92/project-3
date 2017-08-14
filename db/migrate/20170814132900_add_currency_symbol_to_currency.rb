class AddCurrencySymbolToCurrency < ActiveRecord::Migration[5.1]
  def change
    add_column :currencies, :currency_symbol, :string
  end
end

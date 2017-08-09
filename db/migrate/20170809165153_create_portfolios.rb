class CreatePortfolios < ActiveRecord::Migration[5.1]
  def change
    create_table :portfolios do |t|
      t.references :user, foreign_key: true
      t.references :currency, foreign_key: true
      t.decimal :total_units

      t.timestamps
    end
  end
end

class Currency < ApplicationRecord
  has_many :portfolios
  has_many :transactions
end

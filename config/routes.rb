Rails.application.routes.draw do

  devise_for :users,
              path: '',
              path_names:{
                sign_in: 'login',
                sign_out: 'logout',
                sign_up: 'register'
              }

  root 'static#home', as: 'home'

  get '/overallstats', to: 'stats#index'

  resources :portfolios

  resources :transactions



  get '/analysis', to: 'analysis#show'
  get '/stats', to: 'stats#index'
  get '/contact', to: 'static#contact', as: 'contact'
  #  as: 'analysis'
  # get '/portfolio', to:'portfolio#show', as: 'portfolio'

  resources :social_trading
end

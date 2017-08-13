Rails.application.routes.draw do

  devise_for :users,
              path: '',
              path_names:{
                sign_in: 'login',
                sign_out: 'logout',
                sign_up: 'register'
              }

  root 'static#home', as: 'home'

  resources :portfolios

  resources :transactions



  get '/analysis', to: 'analysis#show', as: 'analysis'
  # get '/portfolio', to:'portfolio#show', as: 'portfolio'

end

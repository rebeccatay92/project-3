class StaticController < ApplicationController
  skip_before_action :authenticate_user!

  def home
    if current_user
      redirect_to analysis_path
    end
  end

end

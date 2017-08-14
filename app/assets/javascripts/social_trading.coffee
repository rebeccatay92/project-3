# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

# ready page:load

$(document).on 'turbolinks:load', (event) ->
  $('#positionsTable').DataTable({
        searching: false,
        ordering: false,
        select: false,
        paging: true
      })
  # alert('hello social trading')

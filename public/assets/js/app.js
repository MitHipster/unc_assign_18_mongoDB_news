/*jslint esversion: 6, browser: true*/
$(document).ready(function () {
  // Initialize side nav bar for mobile and set width
  $(".button-collapse").sideNav({
    menuWidth: 250,
    closeOnClick: true
  });

  // Initialize modal for adding remarks
  // Modal can be dismissed by clicking outside of the modal
  $('.modal').modal({ dismissible: true });
});

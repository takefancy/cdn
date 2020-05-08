$(function() {
  $('.perfect-scrollbar').each(function() {
    new PerfectScrollbar($(this)[0]);
  });
  $('.toogle-nav').click(function() {
    $('body').toggleClass("menu-open menu-hide");
  });
});
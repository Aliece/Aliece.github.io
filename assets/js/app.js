$(document).ready(function() {
    
    $('#nav_ul li').click(function (e) {
      $(this).attr('class','active');
      $("#nav_ul li[class='active']").removeClass("active"); 
    });
});

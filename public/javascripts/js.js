$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 51) {
        $(".second").addClass("fixed-top");
    } else {
        $(".second").removeClass("fixed-top");
    }
});


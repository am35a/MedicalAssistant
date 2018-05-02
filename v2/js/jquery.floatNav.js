//  Show or hide float navigation

        $(function() {
            $(window).scroll(function() {
                if ($(this).scrollTop() > $(window).height()) {
                    $('.obj-toggle-float-nav').addClass('fade-in');
                    $('.obj-main').css('padding-bottom', $('.obj-toggle-float-nav').height())
                } else {
                    $('.obj-toggle-float-nav').removeClass('fade-in');
                    $('.obj-main').css('padding-bottom', '')
                }
            });
            
            $('.act-jump-to-top').click(function() {
                $('body, html').animate({scrollTop: 0}, 500);
                return false;
            });
        });        

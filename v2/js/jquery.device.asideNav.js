//  Show or hide aside navigation

        var isAsideNavOpen = $('.obj-aside-nav').position().left < 0 ? false : true,
            scrollTopForAsideNav;
        
//            $('html').hasClass('mobile') || ( $('html').hasClass('tablet') && $('html').hasClass('portrait')) || $(window).width() <= 768
        
        $(function(){
            
            $('.act-toggle-aside-nav').swipe({
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData, currentDirection){
                    if(isAsideNavOpen) {
                        if($(window).width() < 768) {
                            $('.obj-aside-nav').css('left', 'calc(var(--side-nav-width) * -1)');
                            $('.obj-main').css('position', '').css('top', '');
                            window.scrollTo( 0, scrollTopForAsideNav );
                            isAsideNavOpen = false;
                        } else {
                            $('.obj-aside-nav').css('left', 'calc(var(--side-nav-width) * -1)');
                            $('.obj-main').css('padding-left', '0');
                            
                            isAsideNavOpen = false;
                        }
                    }
                },
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData, currentDirection){
                    if(!isAsideNavOpen) {
                        if($(window).width() < 768) {
                            $('.obj-aside-nav').css('left', '0');
                            scrollTopForAsideNav = $(document).scrollTop();
                            $('.obj-main').css('position', 'fixed').css('top', scrollTopForAsideNav * -1);
                            isAsideNavOpen = true;
                        } else {
                            $('.obj-aside-nav').css('left', '0');
                            $('.obj-main').css('padding-left', '');
                            
                            isAsideNavOpen = true;
                        }
                    }
                },
                excludedElements: 'label, button, input, select, textarea'
            });
            
        });

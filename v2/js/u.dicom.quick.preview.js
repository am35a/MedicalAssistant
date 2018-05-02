/*--      DICOM quick preview      --*/
        $(function(){
            //  Open DICOM quick preview
            $('.act-opendicom').on('click', function(){
				$('.obj-opendicom').toggle();
                pageScroll('hidden');

//                $('main').css('overflow', 'hidden').css('height', '10px');
//                toggleFullScreen();
            });
            
        });
        //  Close DICOM quick preview
        function actCloseDICOM(){
            $('.obj-opendicom').toggle();
            pageScroll('auto');

//            $('main').css('overflow', 'auto').css('height', 'auto');
//            toggleFullScreen();
        }
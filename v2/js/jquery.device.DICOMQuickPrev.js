//  DICOM quick preview

        var isMobile,
            edgeDistance,
            isMoveDICOM = false;
        
        var tmpXV, tmpYV;

        $(function(){
            
            $('.act-opendicom-slice').mousewheel(function(event) {
//                console.log(event.deltaX, event.deltaY, event.deltaFactor);
                if(event.deltaY < 0 && DICOMPlayData.start > 1)
                    DICOMPlayData.start--;
                if(event.deltaY > 0 && DICOMPlayData.start < DICOMPlayData.end)
                    DICOMPlayData.start++;
                openDICOMSliceUpData();
            });
            
            $('.act-opendicom-slice').swipe({
                swipeStatus:function(event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection){
                    // Scroll DICOM slices
                    // - Reset edge of distance
                    if(fingerCount == '1' && phase == 'start' && !isMoveDICOM)
                        edgeDistance = 0;
                    // - Scroll to left side from start
                    if(fingerCount == '1' && phase == 'move' && direction == 'left' && !isMoveDICOM){
                        distance *= -1;
                        if(edgeDistance < distance && DICOMPlayData.start < DICOMPlayData.end)
                            DICOMPlayData.start++;
                        if(edgeDistance > distance && DICOMPlayData.start > 1)
                            DICOMPlayData.start--;
                        edgeDistance = distance;
                        openDICOMSliceUpData();
                    }
                    // - Scroll to right side from start
                    if(fingerCount == '1' && phase == 'move' && direction == 'right' && !isMoveDICOM){
                        if(edgeDistance < distance && DICOMPlayData.start < DICOMPlayData.end)
                            DICOMPlayData.start++;
                        if(edgeDistance > distance && DICOMPlayData.start > 1)
                            DICOMPlayData.start--;
                        edgeDistance = distance;
                        openDICOMSliceUpData();
                    }
                    
                    // Move container width DICOM slices
                    if(fingerCount == '1' && phase == 'start' && isMoveDICOM){
                        DICOM.x = parseInt($('.obj-opendicom-slice-move').css('left').replace('px', ''));
                        DICOM.y = parseInt($('.obj-opendicom-slice-move').css('top').replace('px', ''));
                    }
                    if(fingerCount == '1' && phase == 'move' && isMoveDICOM){
                        DICOM.xMove = DICOM.x + fingerData[0].last.x - fingerData[0].start.x;
                        DICOM.yMove = DICOM.y + fingerData[0].last.y - fingerData[0].start.y; 
                        $('.obj-opendicom-slice-move').css('left', DICOM.xMove).css('top', DICOM.yMove);
                    }
                    if(fingerCount == '1' && (phase == 'cancel' || phase == 'end') && isMoveDICOM){
                        
                        tmpXV = ($('.obj-opendicom-slice-zoom')[0].getBoundingClientRect().width - $('.obj-opendicom-slice-move')[0].getBoundingClientRect().width) / 2;
                        tmpYV = ($('.obj-opendicom-slice-zoom')[0].getBoundingClientRect().height - $('.obj-opendicom-slice-move')[0].getBoundingClientRect().height) / 2;
                        if( DICOM.xMove > 0 && DICOM.xMove > tmpXV) DICOM.xMove = tmpXV;
                        else if( DICOM.xMove < 0 && DICOM.xMove < tmpXV * -1 ) DICOM.xMove = tmpXV * -1;
                        if( DICOM.yMove > 0 && DICOM.yMove > tmpYV) DICOM.yMove = tmpYV;
                        else if( DICOM.yMove < 0 && DICOM.yMove < tmpYV * -1 ) DICOM.yMove = tmpYV * -1;
                        
                        DICOM.x = DICOM.xMove;
                        DICOM.y = DICOM.yMove;
                        openDICOMUpData();
                    }
                        
                },
                pinchStatus:function(event, phase, direction, distance , duration , fingerCount, pinchZoom, fingerData){
                    if(fingerCount == '2'){
                        if(DICOM.zoom >= 1 && DICOM.zoom <= 2){
                            DICOM.zoom += (pinchZoom - 1) * 0.1 ;
                            if(DICOM.zoom > 2) DICOM.zoom = 2;
                            else if(DICOM.zoom < 1) DICOM.zoom = 1;
                            $('.obj-opendicom-slice-zoom').css('transform', 'scale(' + DICOM.zoom + ')');
                            $('.obj-status').html(DICOM.zoom);
                        }
                    }
                },
                tap:function(event, target) {
                    //without single tap do not work doubleTap
                },
                doubleTap:function(event, target) {
                    isMoveDICOM = (!isMoveDICOM) ? true : false;
                    console.log(isMoveDICOM);
                },
                threshold:100,
                fingers:'all'
            });
            
        });
        
        function preloadDICOMSlices(e){
            if(DICOMPlayData.expert != e.dataset.expert || DICOMPlayData.dicom != e.dataset.dicom || DICOMPlayData.series != e.dataset.series){
                DICOMPlayData.expert = e.dataset.expert;
                DICOMPlayData.dicom = e.dataset.dicom;
                DICOMPlayData.series = e.dataset.series;
                DICOMPlayData.start = e.dataset.start;
                DICOMPlayData.end = e.dataset.end;
                DICOMPlayData.ext = e.dataset.ext;
                DICOMPlayData.url = e.dataset.url;
                actRestoreDICOM();
                openDICOMSliceUpData();
                document.getElementById('obj-opendicom-slice-preload').innerHTML = '';
                for (var i = 1; i <= DICOMPlayData.end; i++) {
                    var DICOMSlice = document.createElement('img');
                    DICOMSlice.src = DICOMPlayData.url + '/' + DICOMPlayData.expert + '/' + DICOMPlayData.dicom + '/' + DICOMPlayData.series + '/' + i + '.' + DICOMPlayData.ext;
                    document.getElementById('obj-opendicom-slice-preload').appendChild(DICOMSlice);
                }
            }
        }
        
        var DICOMDefault = {
            x:      0,
            y:      0,
            xMove:  0,
            yMove:  0,
            rotate: 0,
            zoom:   1,
            hlip:   1,
            vlip:   1,
            motion: 100,
        },
            DICOM = Object.create(DICOMDefault);
        
        var DICOMPlayData = {
            expert: '',
            dicom:  '',
            series: '',
            start:  '',
            end:    '',
            ext:    '',
            url:    ''
        }

        //  Open DICOM quick preview
        function actOpenDICOM(e){
            
            if($(window).width() >= 736 || ($(window).width() < 736 && !isAsideNavOpen)) {
                preloadDICOMSlices(e);
                $('.obj-opendicom').toggle();
                $('html').css('overflow', 'hidden');
                if(isMobile = ($('html').hasClass('mobile') || $('html').hasClass('tablet')) ){
                    $('main').css('overflow', 'hidden').css('height', '10px');
                    toggleFullScreen();
                }
            }
        }
        
        //  Close DICOM quick preview
        function actCloseDICOM(){
            actOpenDICOMPlay(0);
            $('.obj-opendicom').toggle();
            $('html').css('overflow', 'auto');
            if(isMobile){
                $('main').css('overflow', 'auto').css('height', 'auto');
                toggleFullScreen();
            }
        }
        var dir, playTimeOut;
        //  Play DICOM quick preview
        function actOpenDICOMPlay(direction) {
            if (dir !== direction) {
                dir = direction;
                if(playTimeOut)
                    clearTimeout(playTimeOut);
                if(direction == 1) {
                    $('.obj-opendicom-stopbackward, .obj-opendicom-playforward').hide();
                    $('.obj-opendicom-playbackward, .obj-opendicom-stopforward').css('display', 'inline-flex');
                } else
                    if(direction == -1) {
                        $('.obj-opendicom-stopforward, .obj-opendicom-playbackward').hide();
                        $('.obj-opendicom-playforward, .obj-opendicom-stopbackward').css('display', 'inline-flex');
                    } else {
                        $('.obj-opendicom-stopforward, .obj-opendicom-stopbackward').hide();
                        $('.obj-opendicom-playforward, .obj-opendicom-playbackward').css('display', 'inline-flex');
                    }
            }
            
            DICOMPlayData.start = parseInt(DICOMPlayData.start) + 1 * dir;
            
            if(DICOMPlayData.start < 1)
                DICOMPlayData.start = DICOMPlayData.end;
            if(DICOMPlayData.start > DICOMPlayData.end)
                DICOMPlayData.start = 1;
            
            openDICOMSliceUpData();
            
            if (dir != 0)
            {
                playTimeOut = setTimeout(function() { actOpenDICOMPlay(dir); }, DICOM.motion);
                console.log('Play', dir);
            }
        }

        // Open extra menu in DICOM quick preview
        function actOpenDICOMExtraMenuToggle(){
            if($('.obj-opendicom-menuextra').is(':visible'))
                $('.obj-opendicom-menuextra').css('display', 'none');
            else
                $('.obj-opendicom-menuextra').css('display', 'flex');
        }
        
        // Change motion speed DICOM in DICOM quick preview
        function actOpenDICOMMotionSpeed() {
            DICOM.motion = (DICOM.motion == DICOMDefault.motion) ? DICOM.motion * 3 : DICOMDefault.motion
            $('.obj-opendicom-motionspeed').toggleClass('background-success');
        }
        
        // Fliping DICOM in DICOM quick preview
        // Horizontal Flip
        function actOpenDICOMFlipHorizontal() {
            DICOM.vlip *= -1;
            openDICOMUpData();
            $('.obj-opendicom-fliphorizontal').toggleClass('background-success');

        }
        // Vertical Flip
        function actOpenDICOMFlipVertical() {
            DICOM.hlip *= -1;
            openDICOMUpData();
            $('.obj-opendicom-flipvertical').toggleClass('background-success');
        }

        // Rotating DICOM in DICOM quick preview
        function actOpenDICOMRotate() {
            DICOM.rotate += 45;
            openDICOMUpData();
        }

        // Zooming DICOM in DICOM quick preview
        // Zoom in
        function actOpenDICOMZoomIn() {
            if (DICOM.zoom < 2) {
                DICOM.zoom += .2;
                openDICOMUpData();
            }
        }
        // Zoom out
        function actOpenDICOMZoomOut() {
            if (DICOM.zoom > 1) {
                DICOM.zoom -= .2;
                openDICOMUpData();
            }
        }

        // Restore DICOM in DICOM quick preview
        function actRestoreDICOM() {
            DICOM = Object.create(DICOMDefault);
            $('.obj-opendicom-flipvertical, .obj-opendicom-fliphorizontal, .obj-opendicom-motionspeed').removeClass('background-success');
            openDICOMUpData();
        }
        
        function openDICOMUpData() {
//            $('.obj-status').html(DICOM.zoom);
            $('.obj-opendicom-slice-move').css('left', DICOM.x).css('top', DICOM.y);
            $('.obj-opendicom-slice-flip').css('transform', 'scaleX(' + DICOM.vlip + ') scaleY(' + DICOM.hlip + ')');
            $('.obj-opendicom-slice-rotate').css('transform', 'rotate(' + DICOM.rotate + 'deg)');
            $('.obj-opendicom-slice-zoom').css('transform', 'scale(' + DICOM.zoom + ')');
        }
        function openDICOMSliceUpData() {
            $('.obj-opendicom-slice-img').attr('src', DICOMPlayData.url + '/' + DICOMPlayData.expert + '/' + DICOMPlayData.dicom + '/' + DICOMPlayData.series + '/' + DICOMPlayData.start + '.' + DICOMPlayData.ext);
            $('.obj-opendicom-statusbar').css('width', parseInt(DICOMPlayData.start/DICOMPlayData.end*100) + '%');
        }


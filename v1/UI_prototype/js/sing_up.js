            $(document).ready(function(){
                $( "#sign-up_info button" )
                    .on ( "click", function() {
                        $( "#sign-up" ).removeClass( "mdl-hide" );
                        $( "#sign-up_info" ).addClass( "mdl-hide" );
                        $( "#fixed-tab-2, #tab-2" ).removeClass( "is-active" );
                        $( "#fixed-tab-1, #tab-1" ).addClass( "is-active" );
                        /*$( "#sign-up button" ).attr( "disabled", "" );*/
                        /*$( "input").val('');*/
                    });
                $( "#fogot_info button" )
                    .on ( "click", function() {
                        $( "#fogot" ).removeClass( "mdl-hide" );
                        $( "#fogot_info" ).addClass( "mdl-hide" );
                        $( "#fixed-tab-3, #tab-3" ).removeClass( "is-active" );
                        $( "#fixed-tab-1, #tab-1" ).addClass( "is-active" );
                    });
            });
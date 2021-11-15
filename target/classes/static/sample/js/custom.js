$( document ).ready( function() {

  /* input file */
  iptFileUi( '.ipt_file' );

});

var iptFileUi = function( target ) {
  $( target ).each( function() {
    $( this ).find( 'input[type=file]' ).on( 'change' , function() {
        if ( window.FileReader ) {
          var filename = $(this)[0].files[0].name;
        } else {
          var filename = $(this).val().split('/').pop().split('\\').pop();
        };

        if ( $( this ).siblings( 'input[type=text]' ) ) {
          $( this ).siblings( 'input[type=text]' ).val( filename );
        }
    });
  });
};

(function ($) {
    "use strict";


    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var title = $('.validate-input input[name="title"]');
    var email = $('.validate-input input[name="author"]');
    var publisher = $('.validate-input input[name="publisher"]');
    var type = $('.validate-input input[name="type"]');
    var isbn = $('.validate-input input[name="isbn"]');


    $('.validate-form').on('submit',function(){
        event.preventDefault();
        var check = true;

        if($(title).val().trim() == ''){
            showValidate(title);
            check=false;
        }
        if($(email).val().trim() == ''){
            showValidate(email);
            check=false;
        }
        if($(publisher).val().trim() == ''){
            showValidate(publisher);
            check=false;
        }
        if($(type).val().trim() == ''){
            showValidate(type);
            check=false;
        }
        if($(isbn).val().trim() == ''){
            showValidate(isbn);
            check=false;
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
       });
    });

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);
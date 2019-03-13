$(function () {
    
    $('#contact-form').validator();

    // TODO : Wenn das js im Browser ausgeschaltet ist, die inputfelder ausgrauen und alle mit js entfernen oder entsprechendes verhalten implementieren.    
    // when the form is submitted
    $('#contact-form').on('submit', function (e) {
         
        // if the validator does not prevent form submit
        if (!e.isDefaultPrevented()) {
            var url = "php/contact.php";

            // POST values in the background the the script URL
            $.ajax({
                type: "POST",
                url: url,
                dataType: 'json',
                data: $(this).serialize(),
                success: function (data) {
                    // data = JSON object that contact.php returns
                      
                    // we recieve the type of the message: success x danger and apply it to the 
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    // If we have messageAlert and messageText
                    // inject the alert to .messages div in our form
                    if (data.type === 'success'  && messageText) {

                        // let's compose Bootstrap alert box HTML
                        var successBox = '<div class="alert alert-success alert-dismissable col-sm-offset-1"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';

                        $('#contact-form').find('.messages').html(successBox);
                        // empty the form
                        $('#contact-form')[0].reset();

                    }

                    if (data.type === 'error' && messageText) {

                        // let's compose Bootstrap alert box HTML
                        var dangerBox = '<div class="alert alert-danger alert-dismissable col-sm-offset-1"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';

                        // inject the alert to .messages div in our form
                        $('#contact-form').find('.messages').html(dangerBox);
                        // empty the form
                        $('#contact-form')[0].reset();
                    }
                }
            });
            return false;
        }
    });
});
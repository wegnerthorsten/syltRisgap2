
/*
$( "#from").focusout(function(e) {
       if(e.data ==  null)
       {
           $('input[name=fromDate]').closest('.input-group')
               .addClass('has-error')
               .find('.help-block.with-errors')
               .append("Bitte ein Anreisedatum wÃ¤hlen");
      }
     });
 */

$('#inquiryForm').validator().on('submit', function (e) {

    if (e.isDefaultPrevented()) {
        // handle the invalid form...

    } else {
        // everything looks good!
        e.preventDefault();

        var $form = $(e.target);
        var $url = $('#inquiryForm').attr('action');
        sendEmail($url, $form);
    }

});


$('#commentForm').validator().on('submit', function (e) {

if (e.isDefaultPrevented()) {
  // handle the invalid form...

     } else {
            // everything looks good!
        e.preventDefault();

            var $form = $(e.target);
            var $url = $('#commentForm').attr('action');
            sendEmail($url, $form)
    }
});



var sendEmail = function ($url, $form) {

    $.ajax({
        type: "Post",
        url: $url,
        data: $form.serialize(),
        success: function (data) {

            $.each(data, function(i, item) {

                switch (i)
                {
                    case 'success':

                        // Delete inputs and reset formular validation
                        //$f = $("form#inquiryForm");
                        //$f[0].reset();

                        $form[0].reset();
                        // Ouput formular sended succesfull
                        showRequestMessage(item, $form);

                        break;

                    case 'inquirerEmailAddress', 'inquirerFirstName','inquirerPhone', 'fromDate', 'thruDate', 'inquirerName':
                        $('input[name="' + i + '"]').closest('.form-group')
                            .addClass('has-error')
                            .find('.help-block.with-errors')
                            .append(item);
                        break;

                    case 'failed':
                        // Ouput formular sended failed
                        showRequestMessage(item, $form);
                        break;
                }
            });
        },
        dataType:"json"
    });
}

showRequestMessage = function (data, $form) {

    if($form[0].name == 'inquiryForm')
    {
        $('.responseMessage').remove();
        $('.sendInquery-success').append("<span class='responseMessage'>" + data + "</span>");

    }else if($form[0].name == 'commentForm')
    {
        $('.responseMessage').remove();
        $('.sendComment-success').append("<span class='responseMessage'>" + data + "</span>");
    }


}
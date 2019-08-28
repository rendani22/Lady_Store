var stripe = Stripe('pk_test_qWcZcpF4sqVaQQckTR7n2tsd');

var $form = $('#checkout-form');

$form.submit(function (event) {
    $form.find('button').prop('disabled', true);
    stripe.card.createToken({
        number:$('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val(),
    }).then(function(result) {
        // Handle result.error or result.token
        console.log(result.token);
         if(result.error){
             $('#charge-error').text(result.error.message);
             $('#charge-error').removeClass('hidden');
             $('button').prop('disabled', false);

         }else{
             var token = result.id;

             $form.append($('<input type="hidden" name="stripeToken" />').val(token));
             $form.get(0).submit();
         }
    });
    return false;
});
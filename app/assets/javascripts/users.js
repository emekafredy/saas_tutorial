/* global $, Stripe */

//Use the Document ready function.
$(document).on('turbolinks:load', function() {
    var pForm = $('#pro_form');
    var subBtn = $('#form-submit-btn');
    //Set stript public key.
    Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
    //If user click the submit button; 
    subBtn.click(function(event){
        //Prevent the default submission behaviour(for the sake of payment).
        event.preventDefault();
        
        //Collect credit card fields.
        var cardNum = $('#card_number').val(),
            cvvNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
            
        //Send the card fields info to Stripe.
        Stripe.createToken({
          number: cardNum,
          cvc: cvvNum,
          exp_month: expMonth,
          exp_year: expYear
        }, stripeResponseHandler);
        
        });
   
    //Stripe returns a card token.
    //Add token to form as hidden field.
    //Submit form to our app.
});

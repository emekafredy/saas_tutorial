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
        //Prevent user from clicking twice while waiting
        subBtn.val("Processing").prop('disabled', true);
        
        //Collect credit card fields.
        var cardNum = $('#card_number').val(),
            cvvNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
            
        //Use Stripe JS library to check for card errors(Error Handling).
        var error = false;
        
        //Validate Card Number
        if(!Stripe.card.validateCardNumber(cardNum)) {
            error = true;
            alert('The credit card number appears to be invalid');
        }
        
        //Validate CVC number.
        if(!Stripe.card.validateCVC(cvvNum)) {
          error = true;
          alert('The CVC number appears to be invalid');
        }
        
        //Validate expiration date.
        if(!Stripe.card.validateExpiry(expMonth, expYear)) {
          error = true;
          alert('The expiration date appears to be invalid');
        }
        
        if(error) {
            //If there are card errors, don't send to stripe
            subBtn.prop('disabled', false).val("Sign Up");
        } else {
            //Send the card fields info to Stripe.
            Stripe.createToken({
              number: cardNum,
              cvc: cvvNum,
              exp_month: expMonth,
              exp_year: expYear
            }, stripeResponseHandler);
        }
            
        return false;
        });
   
    //Stripe returns a card token.
    function stripeResponseHandler(status, response) {
        //Get token from the response
        var token = response.id;
        
        //Add token to form as hidden field.
        pForm.append( $( '<input type="hidden" name="user[stripe_card_token]">').val(token) );
    }
    
    //Submit form to our app.
});

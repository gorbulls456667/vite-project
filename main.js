import 'intl-tel-input/build/css/intlTelInput.css';
import './public/custom.css';

import intlTelInput from 'intl-tel-input';

//Change this value to match the ID of the phone field in your form
const phoneNumberInput = $("input[name='phone']");

//Add a hidden field in the form to pass our data to Zapier
$('#cfAR').append('<input type="hidden" id="intl-phone">');
const zapierPhoneData = $('#intl-phone');

const submitButton = $('a[href="#submit-form"]');

//Append the validation message inputs

$(phoneNumberInput).after('<div id="phone-status" class="hide"></div>');
const phoneStatus = $('#phone-status');

// here, the index maps to the error code returned from getValidationError - see readme

const errorMap = [
  'Invalid number',
  'Invalid country code',
  'Too short',
  'Too long',
  'Invalid number',
];

const iti = intlTelInput(phoneNumberInput[0], {
  initialCountry: 'auto',
  nationalMode: false, // da lasciare
  utilsScript:
    'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js?1603274336113',
  geoIpLookup: function (success, failure) {
    $.get('https://ipinfo.io', function () {}, 'jsonp').always(function (resp) {
      var countryCode = resp && resp.country ? resp.country : 'us';
      success(countryCode);
    });
  },
});

function reset() {
  phoneNumberInput.removeClass('error');
  phoneStatus.addClass('hide').html('');
  iti.setNumber(iti.getNumber());
}

// on blur: validate
phoneNumberInput.keyup(function () {
  reset();
  if (phoneNumberInput.val().trim()) {
    if (iti.isValidNumber()) {
      phoneNumberInput.removeClass('invalid-phone').addClass('valid-phone');
      phoneStatus.html('✓ Valid').removeClass('hide');
      submitButton.removeClass('disabled-button');
      zapierPhoneData.val(iti.getNumber());
    } else {
      phoneNumberInput.removeClass('valid-phone').addClass('invalid-phone');
      phoneStatus.removeClass('hide').html(errorMap[iti.getValidationError()]);
      submitButton.addClass('disabled-button');
    }
  }
});

// on keyup / change flag: reset
phoneNumberInput.change(reset);

//initialization
$(function () {
  reset();
});

/* ------------------------------------------------------------------------
	* LC Switch
	* superlight jQuery plugin improving forms look and functionality
	*
	* @version: 	1.1
	* @requires:	jQuery v1.7 or later
	* @author:		Luca Montanari (LCweb)
	* @website:		https://lcweb.it

	* Licensed under the MIT license
------------------------------------------------------------------------- */

(function($){
	"use strict";
	if(typeof($.fn.lc_switch) != 'undefined') {return false;} // prevent multiple script inits



	$.fn.lc_switch = function(on_text, off_text) {

		// destruct
		$.fn.lcs_destroy = function() {

			$(this).each(function() {
                var $wrap = $(this).parents('.lcs_wrap');

				$wrap.children().not('input').remove();
				$(this).unwrap();
            });

			return true;
		};



		// set to ON
		$.fn.lcs_on = function() {
			$(this).each(function(i, v) {
                var $wrap 	= $(this).parents('.lcs_wrap'),
					$input 	= $wrap.find('input');

				// if is already on - skip
				if($wrap.find('.lcs_on').length) {
					return true;
				}

				(typeof($.fn.prop) == 'function') ? $input.prop('checked', true) : $input.attr('checked', true);

				$input.trigger('lcs-on');
				$input.trigger('lcs-statuschange');
				$wrap.find('.lcs_switch').removeClass('lcs_off').addClass('lcs_on');

				// if radio - disable other ones
				if( $wrap.find('.lcs_switch').hasClass('lcs_radio_switch') ) {

					var f_name = $input.attr('name');
					$wrap.parents('form').find('input[name='+f_name+']').not($input).lcs_off();
				}
            });

			return true;
		};



		// set to OFF
		$.fn.lcs_off = function() {

			$(this).each(function() {
                var $wrap 	= $(this).parents('.lcs_wrap'),
					$input 	= $wrap.find('input');

				// if is already off - skip
				if(!$wrap.find('.lcs_on').length) {
					return true;
				}

				// uncheck
				(typeof($.fn.prop) == 'function') ? $input.prop('checked', false) : $input.attr('checked', false);

				$input.trigger('lcs-off');
				$input.trigger('lcs-statuschange');
				$wrap.find('.lcs_switch').removeClass('lcs_on').addClass('lcs_off');
            });

			return true;
		};



		// toggle status
		$.fn.lcs_toggle = function() {
			$(this).each(function() {

				// not for radios
				if( $(this).hasClass('lcs_radio_switch')) {
					return true;
				}

				($(this).is(':checked')) ? $(this).lcs_off() : $(this).lcs_on();
            });

			return true;
		};



		// construct
		return this.each(function(){

			// check against double init
			if( !$(this).parent().hasClass('lcs_wrap') ) {

				// default texts
				var ckd_on_txt 	= (typeof(on_text) == 'undefined') ? 'ON' : on_text,
					ckd_off_txt = (typeof(off_text) == 'undefined') ? 'OFF' : off_text;

			   // labels structure
				var on_label 	= (ckd_on_txt) ? '<div class="lcs_label lcs_label_on">'+ ckd_on_txt +'</div>' : '',
					off_label 	= (ckd_off_txt) ? '<div class="lcs_label lcs_label_off">'+ ckd_off_txt +'</div>' : '';


				// default states
				var disabled 	= ($(this).is(':disabled')) ? true : false,
					active 		= ($(this).is(':checked'))  ? true : false;

				var status_classes = '';
				status_classes += (active) ? ' lcs_on' : ' lcs_off';
				if(disabled) {
					status_classes += ' lcs_disabled';
				}


				// wrap and append
				var structure =
				'<div class="lcs_switch '+status_classes+'">' +
					'<div class="lcs_cursor"></div>' +
					on_label + off_label +
				'</div>';

				if( $(this).is(':input') && ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') ) {

					$(this).wrap('<div class="lcs_wrap"></div>');
					$(this).parent().append(structure);

					$(this).parent().find('.lcs_switch').addClass('lcs_'+ $(this).attr('type') +'_switch');
				}
			}
        });
	};



	// handlers
	$(document).ready(function() {

		// on click
		$(document).on('click tap', '.lcs_switch:not(.lcs_disabled)', function(e) {

			if( $(this).hasClass('lcs_on') ) {
				if( !$(this).hasClass('lcs_radio_switch') ) { // not for radio
					$(this).lcs_off();
				}
			} else {
				$(this).lcs_on();
			}
		});


		// on checkbox status change
		$(document).on('change', '.lcs_wrap input', function() {
			( $(this).is(':checked') ) ? $(this).lcs_on() : $(this).lcs_off();
		});

	});

})(jQuery);


$(document).ready(function() {
	let existingCompanies = $("#result").val().length ? JSON.parse($("#result").val()) : [];
  let fullReportIds = [];
  let i = existingCompanies.length;
  if (existingCompanies.length) {
  	$("#submit").fadeIn(1000);
  }

  $("#counter").text(existingCompanies.length);

  for(let company of existingCompanies) {
  	let checked = company.type === 'Paid' ? 'checked' : '';
    if (company.type === 'Paid') {
    	fullReportIds.push(company.id);
    }
    $("#container").append(`
      <div class="company-box" id="company-${company.id}">
        <p class="name" style="margin-top: 40px">${company.name}</p>
        <p class="contact">${company.contact}</p>
        <p class="email">${company.email}</p>
        <div>
         <label for="full-report">Full report</label>
          <input type="checkbox" class="full-report" name="full-report" ${checked}>
        </div>
        <p class="type">${company.type}</p>
        <button type="button" class="delete-company">Sterge nahui</button>
    	</div>`).children(':last').hide().fadeIn(1000);
  }
  $('#full-report-ids').val(JSON.stringify(fullReportIds));
  $('input').lc_switch();
  let dashedSquaresNr = 3 - existingCompanies.length;
  for(let i = 0; i < dashedSquaresNr; i++) {
   $("#container").append(`
      <div class="company-box-dashed">
    	</div>`).children(':last').hide().fadeIn(1000);
  }


	$("#company-name").on('keyup', function() {
			let name = $("#company-name").val();
      if (name.length >=3) {
        $("#company-contact").parent().fadeIn(1000);
        $("#company-name").addClass('valid');
      } else {
      	$("#company-name").removeClass('valid');
      	$("#company-name").addClass('invalid');
        $("#company-contact").parent().hide();
        $("#company-email").parent().hide();
        $("#add-company").hide();
      }
  });

  $("#company-contact").on('keyup', function() {
			let contact = $("#company-contact").val();
      if (contact.length >=3) {
        $("#company-email").parent().fadeIn(1000);
        $("#company-contact").addClass('valid');
      } else {
      	$("#company-contact").removeClass('valid');
      	$("#company-contact").addClass('invalid');
        $("#company-email").parent().hide();
        $("#add-company").hide();
      }
  });

 	$("#company-email").on('keyup', function() {
			let email = $("#company-email").val();
      if (email.length >= 3 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        $("#add-company").fadeIn(1000);
        $("#company-email").addClass('valid');
      } else {
      	$("#company-email").removeClass('valid');
      	$("#company-email").addClass('invalid');
        $("#add-company").hide();
      }
  });

  $("#add-company").click(function() {
  	const name = $("#company-name").val();
    const contact = $("#company-contact").val();
    const email = $("#company-email").val();
    if (!name.trim() || !contact.trim() || !email.trim()) {
    	if(!name.trim()) {
      	$("#company-name").addClass('invalid');
      }
      if(!contact.trim()) {
      	$("#company-contact").addClass('invalid');
      }
      if(!email.trim()) {
      	$("#company-email").addClass('invalid');
      }
     	console.log('error');
    } else {
    	let counter = parseInt($("#counter").text());
 			++counter;
      $("#counter").text(counter);
   		++i;
    	$("#company-email").removeClass('invalid');
      $("#company-name").removeClass('invalid');
      $("#company-contact").removeClass('invalid');
      $("#company-email").parent().hide();
      $("#company-contact").parent().hide();
      $("#add-company").hide();
      $('#container .company-box-dashed').first().remove();
      newCompany = {
      	id: i.toString(),
        name: name,
        contact: contact,
        email: email,
        type: "Trial"
      }

     	let companyHTML = `<div class="company-box" id="company-${i}">
            <p class="name" style="margin-top: 40px">${name}</p>
            <p class="contact">${contact}</p>
            <p class="email">${email}</p>
            <div>
              <label for="full-report">Full report</label>
          		<input type="checkbox" class="full-report" name="full-report">
            </div>
            <p class="type">Trial</p>
            <button type="button" class="delete-company">Sterge nahui</button>
          </div>`;

     	existingCompanies.push(newCompany);
      if (existingCompanies.length === 1)  {
        $("#container").prepend(companyHTML).children(':last').hide().fadeIn(1000);
      } else if (existingCompanies.length === 2) {
        $(companyHTML).insertBefore($(".company-box-dashed")).children(':last').hide().fadeIn(1000);
      } else {
        $("#container").append(companyHTML).children(':last').hide().fadeIn(1000);
      }


      $("#result").val(JSON.stringify(existingCompanies));
      $("#company-name").val('');
      $("#company-contact").val('');
    	$("#company-email").val('');
      $("#company-name").removeClass('valid');
      $("#company-contact").removeClass('valid');
      $("#company-email").removeClass('valid');
      i++;
      $("#submit").fadeIn(1000);
      $('input').lc_switch();
    }
	});

 	$('#container').on('click', '.delete-company', function(e) {
    e.preventDefault();
    const id = $(this).parent().attr('id').split('-')[1];
  	let counter = parseInt($("#counter").text());
    --counter;
    $("#counter").text(counter);
    var removeIndex = existingCompanies.map(item => item.id).indexOf(id);
		~removeIndex && existingCompanies.splice(removeIndex, 1);
    $("#result").val(JSON.stringify(existingCompanies));
    var index = fullReportIds.indexOf(id);
    ~index && fullReportIds.splice(index, 1);
    $('#full-report-ids').val(JSON.stringify(fullReportIds));
    if (!existingCompanies.length) {
    	$("#submit").hide();
    }
    $(this).parent().remove();
    $("#container").append(`
      <div class="company-box-dashed">
    	</div>`).children(':last').hide().fadeIn(1000);
	});

  $('#container').delegate('.full-report', 'lcs-statuschange', function() {
    const id = $(this).parent().parent().parent().attr('id').split('-')[1];
    if($(this).is(':checked')) {
    	fullReportIds.push(id);
      var index = existingCompanies.map(item => item.id).indexOf(id);
      existingCompanies[index].type = 'Paid';
      $("#result").val(JSON.stringify(existingCompanies));
			$(this).parent().parent().parent().find('.type').text('Paid');
    } else {
      var removeIndex = fullReportIds.indexOf(id);
      var index = existingCompanies.map(item => item.id).indexOf(id);
      existingCompanies[index].type = 'Trial';
      $("#result").val(JSON.stringify(existingCompanies));
			~removeIndex && fullReportIds.splice(removeIndex, 1);
      $(this).parent().parent().parent().find('.type').text('Trial');
    }
    $('#full-report-ids').val(JSON.stringify(fullReportIds));
	});


});

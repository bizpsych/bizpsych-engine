
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

	$('#container').on('change', '.full-report', function(e) {
    const id = $(this).parent().parent().attr('id').split('-')[1];
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
      $(this).parent().parent().find('.type').text('Trial');
    }
    $('#full-report-ids').val(JSON.stringify(fullReportIds));
	});


});

$(document).ready(function() {
	let existingMembers = $("#result").val().length ? JSON.parse($("#result").val()) : [];
  let i = existingMembers.length;
  if (existingMembers.length) {
  	$("#submit").fadeIn(1000);
  }

  $("#counter").text(existingMembers.length);

  for(let member of existingMembers) {
    $("#container").append(`
      <div class="company-box" id="company-${member.id}">
        <p class="name" style="margin-top: 40px">${member.firstName}</p>
        <p class="contact">${member.lastName}</p>
        <p class="email">${member.email}</p>
        <button type="button" class="delete-company">Sterge nahui</button>
    	</div>`).children(':last').hide().fadeIn(1000);
  }
  let dashedSquaresNr = 3 - existingMembers.length;
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
  	const firstName = $("#company-name").val();
    const lastName = $("#company-contact").val();
    const email = $("#company-email").val();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
    	if(!firstName.trim()) {
      	$("#company-name").addClass('invalid');
      }
      if(!lastName.trim()) {
      	$("#company-contact").addClass('invalid');
      }
      if(!email.trim()) {
      	$("#company-email").addClass('invalid');
      }
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
      newMember = {
      	id: i.toString(),
        firstName: firstName,
        lastName: lastName,
        email: email
      }

     	let memberHTML = `<div class="company-box" id="company-${i}">
            <p class="name" style="margin-top: 40px">${firstName}</p>
            <p class="contact">${lastName}</p>
            <p class="email">${email}</p>
            <button type="button" class="delete-company">Sterge nahui</button>
          </div>`;

     	existingMembers.push(newMember);
      if (existingMembers.length === 1)  {
        $("#container").prepend(memberHTML).children(':last').hide().fadeIn(1000);
      } else if (existingMembers.length === 2) {
        $(memberHTML).insertBefore($(".company-box-dashed")).children(':last').hide().fadeIn(1000);
      } else {
        $("#container").append(memberHTML).children(':last').hide().fadeIn(1000);
      }


      $("#result").val(JSON.stringify(existingMembers));
      $("#company-name").val('');
      $("#company-contact").val('');
    	$("#company-email").val('');
      $("#company-name").removeClass('valid');
      $("#company-contact").removeClass('valid');
      $("#company-email").removeClass('valid');
      i++;
    }
	});

 	$('#container').on('click', '.delete-company', function(e) {
    e.preventDefault();
    const id = $(this).parent().attr('id').split('-')[1];
  	let counter = parseInt($("#counter").text());
    --counter;
    $("#counter").text(counter);
    var removeIndex = existingMembers.map(item => item.id).indexOf(id);
		~removeIndex && existingMembers.splice(removeIndex, 1);
    $("#result").val(JSON.stringify(existingMembers));
    if (!existingMembers.length) {
    	$("#submit").hide();
    }
    $(this).parent().remove();
    $("#container").append(`
      <div class="company-box-dashed">
    	</div>`).children(':last').hide().fadeIn(1000);
	});

});

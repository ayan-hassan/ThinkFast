$(document).ready(function() {


  // adds choice to modal
  let optionId = 1
  $('.new_choice').on('click', function(event) {
    event.preventDefault();
    const option =
      `<tr>
    <td><input class="choice" type="text" id="option${++optionId}" placeholder="answer text"></td>
    <td>
      <label>
        <input type="radio" name="correct" id="unlisted${optionId}">
        <span class="check"></span>
      </label>
    </td>
    </tr>
    `;
    $('.choices').append(option);
  });
// Shows Modal
  $('#new_question').on('click', function(event) {
    event.preventDefault();
    const dialog = document.getElementById('modal');
    dialog.showModal();
  });
// adds question to form
  $('.add_question').on("submit", function(event) {
    event.preventDefault();
    const question = $('#question').val()

    let optionString = ""
    for (let i = 1; i <= optionId; i++){
      if ($(`#unlisted${i}`).is(':checked')){

        optionString += `<h4>${$(`#option${i}`).val()}</h4>`
      } else {

        optionString += `<h5>${$(`#option${i}`).val()}</h5>`
      }
    }




    const option =
       `<div class="displayed_question">
         <div class="displayed_question_title">
           <h2>${question}</h2>
         </div>
         <div class="displayed_question_questions">
            ${optionString}
         </div>
        </div>
        `;
    $('.displayed_questions').append(option);


  });
// adjusts description box height
  $(".bio_field").on("keydown", function() {
    $(this).css("height", `${$(this).prop("scrollHeight")}px`);
  });

});

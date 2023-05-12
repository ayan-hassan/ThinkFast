// const { data } = require("jquery");

$(document).ready(function() {



  /////////////////////////////////////////////////////////////variables
  let questionId = 1;
  let optionId = 1;
  let radioId = 1;
  let questionName = 1;

  ///////////////////////////////////////////////////////////////////////////adds option to question
  $('.displayed_questions').on('click', '.new_choice', function(event) {
    event.preventDefault();



    ////////////////////////////////////////////////////////////////ensures correct name is used for options and radio buttons
    const childName = () => {

      const identifier = $(this).closest('.individual_question').find(".question").attr("name");

      return identifier;
    };


    let div = document.createElement('div');
    div.className = 'choice';
    div.name = `test`;

    let input = document.createElement('input');
    input.type = 'text';
    input.id = `${optionId}`;
    input.name = childName();
    input.placeholder = "answer text";
    input.for = `${radioId}`;

    let label = document.createElement('label');
    label.name = "test";

    let radio = document.createElement('input');
    radio.type = "radio";
    radio.id = `${radioId}`;
    radio.for = `option${optionId}`;
    radio.value = "$%**%$";
    radio.name = childName();

    let span = document.createElement('span');
    span.className = 'check';

    label.append(radio);
    label.append(span);

    let p = document.createElement("p");
    p.innerHTML = "correct";

    let a = document.createElement("a");
    a.id = 'remove';
    a.href = "";
    a.innerHTML = "&times";

    div.append(input);
    div.append(label);
    div.append(p);
    div.append(a);

    $(this).prev(".choices").append(div);

  });
  //////////////////////////////////////////////////////////////////////removes option from question
  $('.displayed_questions').on("click", '#remove', function(event) {
    event.preventDefault();
    $(this).closest("div").remove();
  });

  ///////////////////////////////////////////////////////////////////// // adds question to form
  $('.add_question_button').on("click", function(event) {
    event.preventDefault();
    questionId++;
    const option =
      `</div>
</div>

<div id="question${questionId}" class="individual_question">

<container class="x_holder">

  <a href="" id="remove">&times;</a>
</container>


<div>
<input class="question" type="text" name="question${++questionName}"  placeholder="New Question">
</div>

<div >
  <div class="choices">
 <div class="choice">

  <input  type="text"  id="${optionId}" name= "question${questionName}" placeholder="answer text">

    <label>
    <input type="radio" name="question${questionName}" id="unlisted" value="$%**%$">
      <span class="check"></span>
    </label>
    <p>Correct</p>
    <a href="" id="remove">&times</a>
  </div>
  </div>
  <a href="" class="new_choice"> &plus; add option </a>

</div>

</div>
</div>
        `;
    $('.displayed_questions').append(option);

  });
  //////////////////////////////////////////////////////////////////// adjusts description box height
  $("#bio textarea").on("keydown", function() {
    $(this).css("height", `${$(this).prop("scrollHeight")}px`);
  });



  ///////////////////////////////////////////////////////////////Function to parse the DOM response adn run SQL inserts
  $('#quizForm').on("submit", function(event) {
    event.preventDefault();
    let incomplete = false;
    let alertMessage = "";


    $('.individual_question').each(function() {
      let count = 0;
      $('input[type="radio"]:checked', (this)).each(function() {
        count++;
      });

      if (count === 0) {
        incomplete = true;
        alertMessage = "Please ensure all questions have a correct answer";
      }
    });

    $('input[type="text"]').each(function() {
      if ($(this).val().length == 0) {
        incomplete = true;
        alertMessage = "Please ensure all fields are filled out";

      }
    });
    if ($('textarea').val().length == 0) {
      incomplete = true;
      alertMessage = "Please ensure all fields are filled out";
    }

    if ($('input[type="number"').val().length == 0) {
      incomplete = true;
      alertMessage = "Please ensure all fields are filled out";
    }



    if (incomplete === true) {
      alert(alertMessage);

    } else {
      $(this).unbind('submit').submit();

    }
  });

});




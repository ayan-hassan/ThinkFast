$(document).ready(function() {


  // adds choice to modal
  let questionId = 1;
  let optionId = 1;
  let radioId = 1;
  $('.displayed_questions').on('click', '.new_choice', function(event) {
    event.preventDefault();


    const option =

      `<div class="choice">
    <input type="text" id="${optionId}" "name="option${++optionId}_from_question${questionId}" placeholder="answer text">

    <label>
    <input type="radio"  name="correct${questionId}" id="unlisted"${optionId}">
    <span class="check"></span>
    </label>
    <p>Correct</p>
    </div>

    `;
    const radioName = $(this).closest('div').attr("name");

    let div = document.createElement('div');
    div.className = 'choice';
    div.name = `${++optionId}`;

    let input = document.createElement('input');
    input.type = 'text';
    input.id = `${optionId}`;
    input.name = `option${optionId}`;
    input.placeholder = "answer text";
    input.for = `${++radioId}`;

    let label = document.createElement('label');


    let radio = document.createElement('input');
    radio.type = "radio";
    radio.id = `${radioId}`;
    radio.for = `option${optionId}`;
    radio.name = radioName;

    let span = document.createElement('span');
    span.className = 'check';

    label.append(radio);
    label.append(span);

    let p = document.createElement("p");
    p.innerHTML = "correct";

    let a = document.createElement("a");
    a.id = 'remove';
    a.href=""
    a.innerHTML = "&times";

    div.append(input);
    div.append(label);
    div.append(p);
    div.append(a);







    // var jQueryObject = $(option)
    $(this).prev(".choices").append(div);

  });
    $('.displayed_questions').on("click", '#remove', function(event) {
      event.preventDefault();
      console.log($(this).closest("div"))
      $(this).parent(".choice").remove()
    });



  // adds question to form
  $('.add_question_button').on("click", function(event) {
    event.preventDefault();
    questionId++;
    const option =
      `</div>
</div>

<div id="question${questionId}" class="individual_question">

<div>
<input class="question" type="text" name="question${questionId}"  placeholder="New Question">
</div>

<div >
  <div class="choices">
 <div class="choice">
  <input  type="text"  id="${optionId}" name="option${++optionId}_from_question${questionId}" placeholder="answer text">

    <label>
    <input type="radio" name="${questionId}" id="unlisted">
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
  // adjusts description box height
  $("#bio textarea").on("keydown", function() {
    $(this).css("height", `${$(this).prop("scrollHeight")}px`);
  });


});



// for loop

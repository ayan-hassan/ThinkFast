$(document).ready(function() {



  /////////////////////////////////////////////////////////////variables
  let questionId = 1;
  let optionId = 1;
  let radioId = 1;
  let questionName = 1

///////////////////////////////////////////////////////////////////////////adds option to question
  $('.displayed_questions').on('click', '.new_choice', function(event) {
    event.preventDefault();



  ////////////////////////////////////////////////////////////////ensures correct name is used for options and radio buttons
    const childName = () => {

      const identifier = $(this).closest('.individual_question').find(".question").attr("name");

      return identifier
    }


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
    label.name = "test"

    let radio = document.createElement('input');
    radio.type = "radio";
    radio.id = `${radioId}`;
    radio.for = `option${optionId}`;
    radio.value="$%**%$"
    radio.name = childName()

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

    $(this).prev(".choices").append(div);

  });
  //////////////////////////////////////////////////////////////////////removes option from question
    $('.displayed_questions').on("click", '#remove', function(event) {
      event.preventDefault();
      $(this).parent(".choice").remove()
    });

 ///////////////////////////////////////////////////////////////////// // adds question to form
  $('.add_question_button').on("click", function(event) {
    event.preventDefault();
    questionId++;
    const option =
      `</div>
</div>

<div id="question${questionId}" class="individual_question">

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
  // $('#quizForm').on("submit", function(event) {
  //   event.preventDefault();




  // })


/////////data validation
  // document.querySelectorAll('#myform input');
  // if ($('input:text').val().length == 0) {
    //   console.log("Empty field");
    // /////////////////Ayans///////////////////////
// $('.submit-answers').on('click', function() {
//   let allQuestionsAnswered = true;
//   let totalCorrectAnswers = 0;

//   $('.question').each(function() {
//     const question = $(this);
//     let hasAnswer = false;

//     // Check if a radio button is checked
//     if (question.find('input[type="radio"]:checked').length > 0) {
//       hasAnswer = true;
//     }



//     if (!hasAnswer) {
//       allQuestionsAnswered = false;
//       return false; // Break out of the loop if a question is unanswered
//     }
//   });

//   if (!allQuestionsAnswered) {
//     // All questions have not been answered
//     alert('Please answer all of the questions.');
//   } else {
//     // All questions answered sooo...
//     console.log('All questions answered.');

//   })



});


/*

quiz = {
  name: 'Test Quiz'
  category: 'History'
  thumbnail: 'url'
  description: 'great quiz'
  time_limit: 3
  is_unlisted: false
  question1: {
    questionText: 'asdfasdf'
    option1: {
      optionText: 'dsflkdfs'
      is_correct: false
    }
    option2: {
      optionText: 'dsflkdfs'
      is_correct: true
    }
    option3: {
      optionText: 'dsflkdfs'
      is_correct: false
    }
    option4: {
      optionText: 'dsflkdfs'
      is_correct: false
    }

  }
  question2: {
    questionText: 'asdfasdf'
    option1: {
      optionText: 'dsflkdfs'
      is_correct: false
    }
    option2: {
      optionText: 'dsflkdfs'
      is_correct: true
    }
    option3: {
      optionText: 'dsflkdfs'
      is_correct: false
    }
    option4: {
      optionText: 'dsflkdfs'
      is_correct: false
    }

  }
  question3: {
    questionText: 'asdfasdf'
    option1: {
      optionText: 'dsflkdfs'
      is_correct: false
    }
    option2: {
      optionText: 'dsflkdfs'
      is_correct: true
    }
    option3: {
      optionText: 'dsflkdfs'
      is_correct: false
    }
    option4: {
      optionText: 'dsflkdfs'
      is_correct: false
    }

  }
}

//prerequisites

function that can create names for the elements based on where they are added

question element.name itterate on "new question"

option element.name pulls from question element.name

radio element.name pulls from question element.name



STEP 1:
  put quiz data into db and get new quiz key

  INSERT INTO quizzes (fields)
  VALUES (all data)
  RETURNING id;

STEP 2:
  for each question insert question data

  INSERT INTO questions (fields)
  VALUES (quiz_id, text)
  RETURNING id;

STEP 3:
  for each choice in each question, insert choice data

  INSERT INTO choices (fields)
  VALUES (question_id, text, is_correct);




$('#quizForm').filter(':radio').each(function() {
:input[type='radio']


}

$('#quizForm').filter('.bio_field').each(function() {



}



let question_id;



$('#quizForm').filter('.question' || '.choice').each(function() {



  if ($(this).attr('class') === 'question') {
    INSERT INTO questions

  }

  if ($(this).attr('class') === 'option') {
    INSERT INTO options

  }
    */

// for loop


// {
//   '1': '2',
//   '2': '7',
//   '3': '10',


//   quiz_name: 'Test Quiz',
//   category: 'History',
//   thumbnail: 'thumb',
//   description: 'aadsd',
//   time_limit: '33',


//   question1: 'A',
//     option1: '1',
//     option2: '2', // Bool True
//     option3: '3',
//     option4: '4',

//   question2: 'B',
//     option5: '5',
//     option6: '6',
//     option7: '7', // Bool True
//     option8: '8',

//   question3: 'C',
//     option9: '9',
//     option10: '12', // Bool True
//     option11: '11',
//     option12: '12'
// }

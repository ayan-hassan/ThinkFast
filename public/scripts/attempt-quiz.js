$(() => {
  $('#quiz-questions').hide();

  $('.start').on('click', function() {
    $('.start').remove();
    $('#quiz-questions').show();
  });

  $(window).on('scroll', function() {
    $('.timer').addClass("fixOnScroll");
  });

  $('.submit-answers').on('click', function(index) {
    let allQuestionsAnswered = true;

    $('.question').each(function() {
      const question = $(this);
      let hasAnswer = false;

      // Check if a radio button is checked
      if (question.find('input[type="radio"]:checked').length > 0) {
        hasAnswer = true;
      }

      if (!hasAnswer) {
        allQuestionsAnswered = false;
        return false; // Break out of the loop if a question is unanswered
      }
    });

    if (!allQuestionsAnswered) {
      // All questions have not been answered
      alert('Please answer all of the questions.');
    } else {
      // All questions answered sooo...
      console.log('All questions answered.');

      //---------check if answers correct or not----------//

      //send answers to server with ajax?

      const hiddenId = $('#hidden').val();

      $.post('/quiz/' + hiddenId, $('#quiz').serialize())
        //receives the data sent via res.send on the server side, then display results on the page with jquery
        .then(response => $('#results').append(response.response));
    }
  });
});



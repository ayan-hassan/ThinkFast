$(() => {
  $('#quiz-questions').hide();
  $('#shareButton').hide();

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
      $('.start-time').remove();
      $('.submit-answers').remove();
      $('#shareButton').show();

      //---------check if answers correct or not----------//

      //send answers to server with ajax?

      let numOfQuestions = ('#id').length;

      const hiddenId = $('#hidden').val();

      let userScore;

      $.post('/quiz/' + hiddenId, $('#quiz').serialize())
      //receives the data sent via res.send on the server side, then display results on the page with jquery
        .then(response => {
          userScore = response.response;
          $('#results').append("You got  " + response.response + "/" + numOfQuestions + " questions correct!");
        });


      $('#shareButton').on('click', function() {
        const textToShare = "I scored " + userScore + "/" + numOfQuestions + " on this quiz! Check it out on ThinkFast!";

        let urlToShare = 'http://localhost:8080/quiz/1';

        const shareText = encodeURIComponent(textToShare);
        const shareLink = encodeURIComponent(urlToShare);

        urlToShare = 'https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareLink;

        window.open(urlToShare, '_blank');
      });
    }
  });




const timer = function(time_limit) {
  setTimeout(() => {
    $('.submit-answers').trigger('click');
  }, time_limit);

}



});



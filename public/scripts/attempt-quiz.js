$(() => {

  $('#quiz-questions').hide();
  $('#shareButton').hide();

  $('.start').on('click', function() {
    $('.start').remove();
    $('#quiz-questions').show();
    const timer = setInterval(function() {
      let mins = parseInt($('#minutes').html());
      let secs = parseInt($('#seconds').html());
      if (mins === 0 && secs === 0) {
        $('.submit-answers').trigger('click');
        $('.actualTimer').remove();
      }
      if (secs === 0) {
        $('#minutes').html((mins - 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
        $("#seconds").html(59);
      } else {
        $('#seconds').html((secs - 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
      }
    }, 1000);
  });

  $(window).on('scroll', function() {
    $('.timer').addClass("fixOnScroll");
  });

  $('.submit-answers').on('click', function() {
    $('.start-time').remove();
    $('.submit-answers').remove();
    $('#shareButton').show();

    //---------check if answers correct or not----------//

    //send answers to server with ajax

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
    // }
  });




const timer = function(time_limit) {
  setTimeout(() => {
    $('.submit-answers').trigger('click');
  }, time_limit);

}



});



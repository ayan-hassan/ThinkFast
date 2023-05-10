// Client facing scripts here

$(() => {

  $('.quiz-thumbnail').on('click', function(data) {
    window.location.href = `/quiz/${$(this).attr('id')}`;
  });

  $('.featured-quiz').on('click', function(data) {
    window.location.href = `/quiz/${$(this).attr('id')}`;
  });
});

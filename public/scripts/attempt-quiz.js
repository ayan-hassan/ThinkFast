// const renderQuestions = (questions) => {
//   for (const question of questions) {
//     const $questions = createQuizElement(question);
//     ('#quiz-questions').append($questions);
//   }
// };

// const createQuizElement = (question) => {
//   const $question = $('<main>').addClass('question.question');
// }

$(() => {
  $('#quiz-questions').hide();
  $('.start').on('click', function() {
    $('.start').remove();
    $('#quiz-questions').show();
  });

});

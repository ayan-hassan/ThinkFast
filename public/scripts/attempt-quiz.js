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
  $('.start').on('click', function() {
    $('.start').remove();
  });

});

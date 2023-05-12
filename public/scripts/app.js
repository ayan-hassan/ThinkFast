// Client facing scripts here

// const { getQuizByCategory } = require('../../db/queries/index')

$(() => {

  $('.quiz-thumbnail').on('click', function() {
    window.location.href = `/quiz/${$(this).attr('id')}`;
  });

  $('.featured-quiz').on('click', function() {
    window.location.href = `/quiz/${$(this).attr('id')}`;
  });

  const reloadQuizzes = (category) => {
    console.log("Before get", category)
    $.get('/reload', {category})
      .done(function(response) {
        console.log(response)
        $('.standard-quiz').empty();
        for (let quiz of response) {
          $('.standard-quiz').append(`
          <article class="quiz-thumbnail" id="${quiz.id}">
          <div class="quiz-image">
            <img src="${quiz.photo_url}">
            <div class="quiz-name-overlay">
              ${quiz.title}
            </div>
          </div>
          <footer class="label">
            <div class="quiz-category">${quiz.category}</div>
            <div>
              ${quiz.author}
            </div>
          </footer>
        </article>
          `)
        }
    })

  }

  $('.cat-name').on('click', function() {
    let category = $(this).text();
    reloadQuizzes(category)


    // $('.quiz-category').each(function() {
    //   if ($(this).text() !== category) {
    //     $(this).closest('.quiz-thumbnail').remove()
    //   }
    // });
  });
});

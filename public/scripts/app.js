// Client facing scripts here

$(() => {


  const reloadQuizzes = (category) => {
    console.log("Before get", category)
    $.get('/reload', {category})
      .done(function(response) {
        console.log(response)
        $('.standard-quiz').empty();
        for (let quiz of response) {
          $('.standard-quiz').append(`
          <a href="/quiz/${quiz.id}">
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
        </a>
          `)
        }
    })

  }

  $('.cat-name').on('click', function() {
    let category = $(this).text();
    reloadQuizzes(category)

  });
});

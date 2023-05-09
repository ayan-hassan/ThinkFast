const { event } = require("jquery");

$(document).ready(function() {
  $('.new_choice').on('click', function(event) {
    event.preventDefault();
    const option =
      `<tr>
<td><input class="choice" type="text" placeholder="answer text"></td>
<td><input type="checkbox"></td>
</tr>`
;
    $('.choices tr:last').after(option);
    console.log('amazon giftcard');
  });
});

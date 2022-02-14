var word = '';
var row = 1;

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
];

comp_word = () => {
  $().get('/checkword', {word, word}, (resp) => {
    if (resp) {
      for(i=0; i < 5; i++){
        const nth = i+1;
        letter = resp[i];
        col = $(`#row-${row} .letter:nth-of-type(${nth})`);
        col.removeClass('correct other-pos no-letter');
        if (letter.samepos == 1) col.addClass('correct');
        else if (letter.samepos == 0) col.addClass('other-pos');
        else if (letter.samepos == -1) col.addClass('no-letter');
      }

      if (row < 6) row++;
      word = '';
    }
  });
}

comp_key = key => {
  key = key.toLowerCase();
  let keycode = key.charCodeAt();
  
  if (key == 'enter' && word.length == 5) {
    comp_word();
  } else if (key == 'backspace') {
    if (word.length > 0) word = word.slice(0, -1);
  } else {
    if (keycode >= 97 && keycode <= 122 && word.length < 5) word += key;
  }
    
  for (i=0; i < 5; i++) {
    const nth = i+1;
    if (i < word.length) $(`#row-${row} .letter:nth-of-type(${nth})`).text(word[i]);
    else $(`#row-${row} .letter:nth-of-type(${nth})`).text(' ');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $().get('/getwordday', resp => {});

  var keys_html = '';
  keys.forEach( r => {
    keys_html += '<div class="keys-row">'
    r.forEach( l => {
      if (l == 'enter') keys_html += `<div id="key-enter" class="key" data-key="${l}"></div>`;
      else if (l == 'backspace') keys_html += `<div id="key-backspace" class="key" data-key="${l}"></div>`;
      else keys_html += `<div class="key" data-key="${l}">${l}</div>`;
    });
    keys_html += '</div>'
    $('#keyboard').html(keys_html);
  });

  $('body').on('keyup', e => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const key = e.key.toLowerCase();
      comp_key(key);
    }
  });

  $('#keyboard').on('click', '.key', e => {
    const key = $(e.target).attr('data-key');
    comp_key(key);
  });
});

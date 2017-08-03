
var data;

function get_from_api(val) {
  if(val) {
    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php',
      data: { action: 'query', list: 'search', srsearch: val, format: 'json'}, //origin: 'https://www.mediawiki.org'},
      dataType: 'jsonp',
      success: function(r) {
        if (typeof r === 'string') {
          r = JSON.parse(r);
        }
        if(!r.error){
          handleData(r);
        } else {
          throw {
            name: r.error.code,
            message: "Error: " + r.error.info
          };
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert('Search error: ' + xhr.responseText + '. Refresh page.');
      }
    });
  }
}

function handleData(r) {
  data = r;
  var results = data.query.search;

  var list = '';
  var added = 0;

  for(var i = 0; added < 4; i++) {
    var title = results[i].title;
    var snippet = results[i].snippet;

    if( !snippet.includes('</span> may refer to:')) {
      snippet = ($(document).width() < 500) ? clip(snippet, 65) : clip(snippet,180);
      list += '<a href="https://en.wikipedia.org/wiki/' + title + '">' +
        '<li class="list-group-item list-group-item-action flex-column align-items-start">' +
        '<h5 id="title">' + title + '</h5>' +
        '<p id="snippet">' + snippet + ' ...</p>' +
        '</li></a>';
      added++;
    }
  }

  $('#wiki').html(list);
  $('#wiki').css('visibility', 'visible');
}

function clip(s, size) {
  var count = 0;
  var index = 0;
  var last_space = 0;
  var inTag = false;
  while(count < size && index < s.length){
    if(s[index] == '<' || s[index] == '>')
      inTag = !inTag;
    if(s[index] == ' ')
      last_space = index;
    if(!inTag) {
      count++;
    }
    index++;
  }
  return s.substring(0, Math.min(index, last_space));
}

function search_placeholder() {
  return ($(document).width() < 650 ) ? 'Search' : 'Search for page...';
}

$(document).ready(function() {
  // When form input submitted, send request to wikipedia api for search results
  $('#form-1').submit(function( event ) {
    event.preventDefault();

    var val = $('#input').val();

    get_from_api(val);

  });

  function checkWidth() {
    var spl = search_placeholder();
    var input = $('#input')[0];
    if(input.value != spl) {
      input.value = spl;
    }
  }

  $('#input').focus(function () {
    var spl = search_placeholder();
    if(this.value == spl) {
      $('#input-form-wrapper').toggleClass('col-4 col-12');
      $('#input').toggleClass('text-left text-center');
      this.value='';
    }
  });
  $('#input').focusout(function () {
    var spl = search_placeholder();
    if(this.value.length <= 0) {
      $('#wiki').html('');
      $('#wiki').css('visibility', 'hidden');
      $('#input-form-wrapper').toggleClass('col-12 col-4');
      $('#input').toggleClass('text-left text-center');
      this.value=spl;
    }
  });

  checkWidth();

});
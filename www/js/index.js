// init client
var odc = new OneDegreeClient(ODRS['host'], ODRS['version'], ODRS['apiKey']);

// create a status bar
$(document).on('deviceready', function() {
  StatusBar.overlaysWebView(false);
  StatusBar.backgroundColorByName('gray');
});

// tag search on home page
var tags = [
  ['health', 'plus-square', ['alcohol', 'dental', 'drugs', 'food', 'medical', 'mental-health', 'therapy']],
  ['housing', 'home', ['affordable-housing', 'emergency-shelter', 'home-buying', 'rent-assistance', 'shelter', 'tenants-rights', 'foreclosure']],
  ['learning', 'book', ['after-school', 'children', 'scholarships', 'school', 'skills-training', 'tutoring', 'summer', 'college']],
  ['money', 'usd', ['career', 'cash-assistance', 'clothing', 'finances', 'finding-work', 'small-business', 'taxes', 'loans']],
  ['family', 'group', ['child-care', 'domestic-violence', 'immigration', 'lgbt', 'youth']]
];
for (var i = 0; i < tags.length; i++) {
  var category = tags[i][0];
  var icon = tags[i][1];
  var tagList = tags[i][2];
  $('#tag-list').append($('<a href="#" data-role="button" data-icon="' + icon + '" class="tag" id="tag-' + category + '" value="on" data-localize="tags.' + category + '" />').html( _.str.humanize(category)))

  var fieldset = $('<div data-role="controlgroup" data-type="horizontal" data-mini="true" class="tag-list" id="tag-' + category + '-list" />');
  for (var j = 0; j < tagList.length; j++) {
    fieldset.append($('<a href="#" class="ui-btn" id="tag-' + tagList[j] + '" />').html(_.str.humanize(tagList[j])));
  }
  $('#tag-lists').append(fieldset);
}

$('[data-role=controlgroup][id!=tag-list]').hide();
$('.tag').on('click', function() {
  $('[data-role=controlgroup][id!=tag-list]').fadeOut(200);
  $('#' + $(this).attr('id') + '-list').delay(201).fadeIn(200);
});
$('.tag-list a').on('click', function() {
  opportunitySearch($(this).attr('id').substring(4));
});

$('#home_search').on('submit', function() {
  opportunitySearch($('#search').val());
  return false;
})

function opportunitySearch(query) {
  $.mobile.loading('show', {
    text: "Searching opportunities",
    textVisible: true
  });
  
  var opps = odc.findOpportunities(query, function(data) {
    $('#opportunity-results ul').empty();
    $.each(data['opportunities'], function(index, opp) {
      var result = $('<li><a href="#"><h3><div class="rating"></div><div class="title"></div></h3><p></p></a></li>');
      result.find('.title').html(opp['title']);
      if (opp['rating'] > 0) {
        for (var i = 0; i < 5; i++) {
          result.find('.rating').append('<span class="ui-btn-icon-left ui-icon-star' + (i < opp['rating'] ? '' : '-o')  + '"></span>');          
        }
      }
      result.find('p').html(_.str.prune(opp['description'], 200));
      result
        .data('title', opp['title'])
        .data('description', opp['description'])
        .data('rating', opp['rating'])
        .data('organization', opp['organization']['name']);
      $('#opportunity-results ul').append(result);
    });
    $.mobile.loading('hide');
    $.mobile.pageContainer.pagecontainer('change', '#opportunities');
  });
}

$('#opportunity-results').on('click', 'a', function() {
  var result = $(this).parent('li');
  $('#opportunity-rating').empty();
  if (result.data('rating') > 0) {
    for (var i = 0; i < 5; i++) {
      $('#opportunity-rating').append('<span class="ui-btn-icon-left ui-alt-icon ui-icon-star' + (i < result.data('rating') ? '' : '-o')  + '"></span>');          
    }
  }
  var fields = ['title', 'description', 'organization', 'requirements'];
  _(fields).each(function(f) {
    $('#opportunity-' + f).html(result.data(f));  
  });
  $('#opportunity-organization').attr('href', '#');
  $.mobile.pageContainer.pagecontainer('change', '#opportunity-detail', { transition: 'slide' });
});

// Initialize localization
$('#language-selector').on('change', function(e) {
  var opts = { language: $(this).val(), pathPrefix: "./locales" };
  $("[data-localize]").localize("application", opts);
});

//   c.getTranslations(['organizations', 1, 'opportunities', 1], 'es', function(data) {
//     $('#test_area').html("Title in Spanish: " + data['title']);
//   });


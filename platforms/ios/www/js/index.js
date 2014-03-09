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
  $('#tag-list').append($('<a href="#" data-role="button" data-icon="' + icon + '" class="tag" id="tag-' + category + '" value="on" />').html( _.str.humanize(category)))

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
    $('#opportunity_results').empty();
    $.each(data['opportunities'], function(index, opp) {
      var result = $('<div class="ui-corner-all custom-corners"></div>');
      var header = $('<div class="ui-bar ui-bar-a"><h3><div class="rating"></div><div class="title"></div></h3></div>');
      var content = $('<div class="ui-body ui-body-a"><p></p></div>');
      header.find('.title').html(opp['title']);
      if (opp['rating'] > 0) {
        for (var i = 0; i < 5; i++) {
          header.find('.rating').append('<span class="ui-btn-icon-left ui-icon-star' + (i < opp['rating'] ? '' : '-o')  + '"></span>');          
        }
      }
      content.find('p').html(_.str.prune(opp['description'], 200));
      result.append(header).append(content);
      $('#opportunity_results').append(result);
    });
    $.mobile.loading('hide');
    $.mobile.pageContainer.pagecontainer('change', '#opportunities');
  });
}

//   c.getTranslations(['organizations', 1, 'opportunities', 1], 'es', function(data) {
//     $('#test_area').html("Title in Spanish: " + data['title']);
//   });


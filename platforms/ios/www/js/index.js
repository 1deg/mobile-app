$(document).on('deviceready', function() {
  StatusBar.overlaysWebView(false);
  StatusBar.backgroundColorByName('gray');
});

// tag search on home page
var tags = [
  ['health', ['alcohol', 'dental', 'drugs', 'food', 'medical', 'mental-health', 'therapy']],
  ['housing', ['affordable-housing', 'emergency-shelter', 'home-buying', 'rent-assistance', 'shelter', 'tenants-rights', 'foreclosure']],
  ['learning', ['after-school', 'children', 'scholarships', 'school', 'skills-training', 'tutoring', 'summer', 'college']],
  ['money', ['career', 'cash-assistance', 'clothing', 'finances', 'finding-work', 'small-business', 'taxes', 'loans']],
  ['family', ['child-care', 'domestic-violence', 'immigration', 'lgbt', 'youth']]
]
for (var i = 0; i < tags.length; i++) {
  var category = tags[i][0];
  var tagList = tags[i][1];
  $('#tag-list')
    .append($('<input type="radio" name="tag" id="tag-' + category + '" value="on">'))
    .append($('<label for="tag-' + category + '">' + _.str.humanize(category) + '</label>'));

  var fieldset = $('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" id="tag-' + category + '-list" />');
  for (var j = 0; j < tagList.length; j++) {
    fieldset.append($('<input type="radio" data-tag-search="true" id="tag-' + tagList[j] + '" value="on">'));
    fieldset.append($('<label for="tag-' + tagList[j] + '">' + _.str.humanize(tagList[j]) + '</label>'));
  }
  $('#tag-lists').append(fieldset);
}

$('[data-role=controlgroup][id!=tag-list]').hide();
$('[name=tag]').on('click', function() { //
  $('[data-role=controlgroup][id!=tag-list]').fadeOut(200);
  $('#' + $(this).attr('id') + '-list').delay(201).fadeIn(200);
});
$('[data-tag-search=true]').on('click', function() {
  var tag = $(this).attr('id').substring(4);
  $('#temp').html(tag);
  $(':mobile-pagecontainer').pagecontainer('change', '#opportunities');
});

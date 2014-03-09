// init client
var odc = new OneDegreeClient(ODRS['host'], ODRS['version'], ODRS['apiKey']);

$.mobile.defaultPageTransition = 'slide';

// create a status bar
$(document).on('deviceready', function() {
  StatusBar.overlaysWebView(false);
  StatusBar.backgroundColorByName('gray');
});

// Initialize current locale
$(document).on('ready', function() {
  reloadLocale();
});

function reloadLocale() {
  $.i18n.init({
    lng: $.i18n.lng(),
    resGetPath:"locales/__lng__/translation.json",
    fallbackLng: 'en'
  }, function() {
    $('body').i18n();
  });
}

// Change locales
$('#language-selector').on('change', function(e) {
  $.i18n.setLng($(this).val());
  reloadLocale();
});

// tag search on home page
for (var i = 0; i < tags.length; i++) {
  var category = tags[i][0];
  var icon = tags[i][1];
  var tagList = tags[i][2];
  $('#tag-list').append($('<a href="#" data-role="button" data-icon="' + icon + '" class="tag" id="tag-' + category + '" value="on" data-i18n="tags.' + category + '" />').html(category));

  var fieldset = $('<div data-role="controlgroup" data-type="horizontal" data-mini="true" class="tag-list" id="tag-' + category + '-list" />');
  for (var j = 0; j < tagList.length; j++) {
    fieldset.append($('<a href="#" class="ui-btn" id="tag-' + tagList[j] + '" data-i18n="tags.' + tagList[j] + '" />').html(tagList[j]));
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
    text: $.t("Searching opportunities___"),
    textVisible: true
  });
  
  var opps = odc.findOpportunities(query, $.i18n.lng(), function(data) {
    $('#opportunity-results ul').empty();
    $.each(data['opportunities'], function(index, opp) {
      if($.i18n.lng() != 'en') {
        opp = replaceTranslatableFields(opp);
      }
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
        .data('organization', opp['organization']['name'])
        .data('organization-id', opp['organization']['id'])
        .data('requirements', opp['requirements'])
        .data('locations', opp['locations'])
        .data('schedule', opp['schedule'])
        .data('phones', opp['phones']);
      $('#opportunity-results ul').append(result);
    });
    $.mobile.loading('hide');
    $.mobile.pageContainer.pagecontainer('change', '#opportunities');
  });
}

function niceifyTime(raw) {
  if (raw === undefined || raw == '') {
    return "";
  }
  if (raw.substring(0, 2) > 12) {
    return (raw.substring(0, 2) - 12) + raw.substring(2) + ' pm';
  } else {
    return raw + ' am';
  }
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
  $('#opportunity-organization').attr('href', '#').data('organization-id', result.data('organization-id'));

  $('#opportunity-where').html(_.map(result.data('locations'), function(location) {
    return location.address + (location.unit == '' ? '' : ', ' + location.unit) + '<br />' + location.city + ', ' + location.state + ' ' + location.zip_code;
  }).join('<br /><br />'));

  $('#opportunity-when').html(_.map(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], function(day) {
    if (result.data('schedule')[day + '_start'] != null && result.data('schedule')[day + '_start'] == '') {
      return '<b>' + _.str.capitalize($.t('days.' + day)) + ':</b> ' + $.t('Closed');
    } else {
      return '<b>' + _.str.capitalize($.t('days.' + day)) + ':</b> ' + niceifyTime(result.data('schedule')[day + '_start']) + ' - ' + niceifyTime(result.data('schedule')[day + '_end']);
    }
  }).join('<br />'));

  $('#opportunity-contact').html(_.map(result.data('phones'), function(phone) {
    return phone['digits'] + (phone['phone_type'] == '' ? '' : ' (' + phone['phone_type'] + ')');
  }).join('<br />'));

  $.mobile.pageContainer.pagecontainer('change', '#opportunity-detail');
});

$('#opportunity-organization').on('click', function() {
  $.mobile.loading('show');

  var opps = odc.getOrganization($(this).data('organization-id'), $.i18n.lng(), function(data) { 
    $('#organization-rating').empty();
    if (data['rating'] > 0) {
      for (var i = 0; i < 5; i++) {
        $('#organization-rating').append('<span class="ui-btn-icon-left ui-alt-icon ui-icon-star' + (i < data['rating'] ? '' : '-o')  + '"></span>');          
      }
    }
    var fields = ['name', 'description'];
    _(fields).each(function(f) {
      $('#organization-' + f).html(data[f]);
    });

    $.mobile.loading('hide');
    $.mobile.pageContainer.pagecontainer('change', '#organization-detail');
  });
});

function replaceTranslatableFields(obj) {
  if(obj['translations'] != null) {
    $.each(_.keys(obj['translations']), function(index, key) {
      obj[key] = obj['translations'][key];
    });
  }
  return obj;
}

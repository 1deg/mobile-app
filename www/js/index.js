// init client
var odc = new OneDegreeClient(ODRS['host'], ODRS['version'], ODRS['apiKey']);

$.mobile.defaultPageTransition = 'slide';

// Change locales
$('#language-selector').on('change', function(e) {
  oldLocale = $.i18n.lng();
  reloadLocale($(this).val());
  mixpanel.track('Changed locales', {
    'previous_locale': oldLocale,
    'new_locale': $.i18n.lng()
  });
});

// tag search on home page
for (var i = 0; i < tags.length; i++) {
  var category = tags[i][0];
  var icon = tags[i][1];
  var tagList = tags[i][2];
  $('#tag-list').append($('<a href="#" data-role="button" data-inline="true" data-icon="' + icon + '" data-iconpos="top" class="tag" id="tag-' + category + '" value="on" data-i18n="tags.' + category + '" />').html(category));

  var fieldset = $('<div data-role="controlgroup" data-type="horizontal" data-mini="true" class="tag-list" id="tag-' + category + '-list" />');
  for (var j = 0; j < tagList.length; j++) {
    fieldset.append($('<a href="#" class="ui-btn ui-btn-inline" id="tag-' + tagList[j] + '" data-i18n="tags.' + tagList[j] + '" />').html(tagList[j]));
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
});

function opportunitySearch(query, page) {

  mixpanel.track('Searched opportunities', {
    'query': query,
    'page': page,
    'location': $('#location').val(),
    'distance': $('#distance').val(),
    'locale': $.i18n.lng()
  });

  if(!app.googleMapsReady) {
    alert($.t("It looks like you_re currently offline_ Please go online before searching_"));
    return false;
  }

  if (!page) page = 1;

  $.mobile.loading('show', {
    text: $.t("Searching opportunities___"),
    textVisible: true
  });

  var lat, lon, geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: $('#location').val() }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      lon = results[0].geometry.location.lng();
    }

    var opps = odc.findOpportunities({
      searchTerm: query,
      lat: lat,
      lon: lon,
      distance: $('#distance').val(),
      page: page
    }, $.i18n.lng(), function(data) {
      $('#opportunity-results ul').empty();
      var oppCount = data['paging']['total_count'];
      if (oppCount == 0) {
        $('.results-found').html($.t('opportunities.0 results'));
      } else if (oppCount == 1) {
        $('.results-found').html($.t('opportunities.1 result'));
      } else if (data['paging']['total_pages'] == 1) {
        $('.results-found').html($.t('opportunities.1 page'), { count: oppCount });
      } else {
        var max = Math.min(data['paging']['total_count'], data['paging']['per_page'] * data['paging']['current_page']);
        var min = data['paging']['per_page'] * (data['paging']['current_page'] - 1) + 1;
        $('.results-found').html($.t('opportunities.X pages', { min: min, max: max, count: oppCount }));
      }
      $.each(data['opportunities'], function(index, opp) {
        if($.i18n.lng() != 'en') {
          opp = replaceTranslatableFields(opp);
        }
        var result = $('<li><a href="#" class="result"><div class="results-li-heading"><div class="rating"></div><div class="icon-container"></div><div class="title"></div></div><div class="results-li-description description"></div></a></li>');
        var icon = iconFromTags(opp['tags']);
        result.find('.title').html(opp['title']);
        if(icon != '') {
          result.find('.icon-container').html('<i class="fa fa-' + iconFromTags(opp['tags']) + ' fa-fw"></i>');
        }
        if (opp['rating'] > 0) {
          for (var i = 0; i < 5; i++) {
            result.find('.rating').append('<span class="ui-btn-icon-left ui-icon-star' + (i < opp['rating'] ? '' : '-o')  + '"></span>');          
          }
        }
        result.find('.description').html(_.str.prune(opp['description'], 140) + ' (' + $.t('read more') + ')');
        result
          .data('id', opp['id'])
          .data('title', opp['title'])
          .data('slug', opp['slug'])
          .data('icon', icon)
          .data('description', opp['description'])
          .data('rating', opp['rating'])
          .data('organization', opp['organization']['name'])
          .data('organization-id', opp['organization']['id'])
          .data('requirements', opp['requirements'])
          .data('locations', opp['locations'])
          .data('schedule', opp['schedule'])
          .data('phones', opp['phones']);
        if(opp['properties']['action-signup-url'] != null && opp['properties']['action-signup-url'] != '') {
          result.data('website', opp['properties']['action-signup-url']);
        }
        $('#opportunity-results ul').append(result);
      });

      if (data['paging']['total_pages'] > data['paging']['current_page']) {
        var showMore = $('<li><a href="#" class="show-more">' + $.t('Show more') + '</li></a>');
        showMore.find('a')
          .data('query', query)
          .data('page', data['paging']['current_page'] + 1);
        $('#opportunity-results ul').append(showMore);
      }

      if (data['paging']['current_page'] > 1) {
        var showPrevious = $('<li><a href="#" class="show-previous">' + $.t('Back') + '</li></a>');
        showPrevious.find('a')
          .data('query', query)
          .data('page', data['paging']['current_page'] - 1);
        $('#opportunity-results ul').prepend(showPrevious);
      }

      $.mobile.silentScroll(0);
      $.mobile.loading('hide');
      $.mobile.pageContainer.pagecontainer('change', '#opportunities');
      $('#opportunity-results ul').listview('refresh');
    });
  });
}

$('#opportunity-results').on('click', 'a.result', function() {
  var result = $(this).parent('li');
  $('#opportunity-rating').empty();
  if (result.data('rating') > 0) {
    for (var i = 0; i < 5; i++) {
      $('#opportunity-rating').append('<span class="ui-btn-icon-left ui-alt-icon ui-icon-star' + (i < result.data('rating') ? '' : '-o')  + '"></span>');          
    }
  }
  var fields = ['title', 'description', 'organization', 'requirements'];
  _(fields).each(function(f) {
    var content = result.data(f);
    if(content == '' || content == null) {
      $('#opportunity-' + f).closest('.panel').hide();
    } else {
      $('#opportunity-' + f).closest('.panel').show();
      if(f == 'requirements') {
        content = parseLinks(content);
      }
      $('#opportunity-' + f).html(content);
    }
  });
  if(result.data('icon') == '') {
    $('#opportunity-title-container i.fa').css('display', 'none');
  } else {
    $('#opportunity-title-container i.fa').css('display', 'inline');
    $('#opportunity-title-container i.fa').addClass('fa-' + result.data('icon'));
  }
  $('#opportunity-organization').attr('href', '#').data('organization-id', result.data('organization-id'));

  // Yes, this is comparing an empty array to an empty string, but apparently you can't compare an empty array to [].
  if(result.data('locations') == '') {
    $('#opportunity-where').closest('.panel').hide();
  } else {
    $('#opportunity-where').closest('.panel').show();
    $('#opportunity-where').html(
      _.map(result.data('locations'), function(location) {
        return locationBlockAndLink(location);
      }).join('<br /><br />'));
  }

  if (allDaysClosed(result.data('schedule'))) {
    $('#opportunity-when').html('<p><em>' + $.t('details.No schedule listed_') + '</em></p>');
  } else {
    $('#opportunity-when').html(_.map(daysList, function(day) {
      if (result.data('schedule')[day + '_start'] != null && result.data('schedule')[day + '_start'] == '') {
        return '<b>' + _.str.capitalize($.t('days.' + day)) + ':</b> ' + $.t('Closed');
      } else {
        return '<b>' + _.str.capitalize($.t('days.' + day)) + ':</b> ' + niceifyTime(result.data('schedule')[day + '_start']) + ' - ' + niceifyTime(result.data('schedule')[day + '_end']);
      }
    }).join('<br />'));
  }

  $('#opportunity-contact').html(_.map(result.data('phones'), function(phone) {
    return phoneContactLine(phone);
  }).join('<br />'));

  if(result.data('website') != '' && result.data('website') != null) {
    if($('#opportunity-contact').html() != '') {
      $('#opportunity-contact').append('<br />');
    }
    $('#opportunity-contact').append(websiteContactLine(result.data('website')));
  }

  $('#view_opportunity_on_1deg').attr('onclick', "window.open('https://www.1deg.org/opportunities/" + result.data('slug') + "?utm_source=duboce&utm_medium=opportunity-details&utm_campaign=view-on-1deg', '_system');");

  mixpanel.track('Viewed opportunity', {
    'opportunity_id': result.data('id'),
    'opportunity_title': result.data('title'),
    'organization_name': result.data('organization'),
    'organization_id': result.data('organization-id'),
    'locale': $.i18n.lng()
  });

  $.mobile.pageContainer.pagecontainer('change', '#opportunity-detail');
}).on('click', 'a.show-more, a.show-previous', function() {
  opportunitySearch($(this).data('query'), $(this).data('page'));
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

    // Yes, this is comparing an empty array to an empty string, but apparently you can't compare an empty array to [].
    if(data['locations'] == '') {
      $('#organization-where').closest('.panel').hide();
    } else {
      $('#organization-where').closest('.panel').show();
      $('#organization-where').html(
        _.map(data['locations'], function(location) {
          return locationBlockAndLink(location);
        }).join('<br /><br />'));
    }

    $('#organization-contact').html(_.map(data['phones'], function(phone) {
      return phoneContactLine(phone);
    }).join('<br />'));

    if(data['website'] && data['website'] != '') {
      if($('#organization-contact').html() != '') {
        $('#organization-contact').append('<br />');
      }
      $('#organization-contact').append(websiteContactLine(data['website']));
    }

    $('#view_organization_on_1deg').attr('onclick', "window.open('https://www.1deg.org/organizations/" + data['slug'] + "?utm_source=duboce&utm_medium=organization-details&utm_campaign=view-on-1deg', '_system');");

    $.mobile.loading('hide');

    mixpanel.track('Viewed organization', {
      'organization_name': data['name'],
      'organization_id': data['id'],
      'locale': $.i18n.lng()
    });

    $.mobile.pageContainer.pagecontainer('change', '#organization-detail');
  });
});

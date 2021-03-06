function niceifyTime(raw) {
  if (raw == null || raw == '') {
    return "";
  }
  if (raw.substring(0, 2) > 12) {
    return (raw.substring(0, 2) - 12) + raw.substring(2) + ' pm';
  } else {
    return raw + ' am';
  }
}

function allDaysClosed(schedule) {
  var allClosed = true;
  $.each(daysList, function(index, dayName) {
    if (schedule[dayName + '_start'] != '' && schedule[dayName + '_start'] != null) {
      allClosed = allClosed && false;
      return;
    }
  });
  return allClosed;
}

function locationAlert(alertClass, message) {
  $('#location_status').html(message);
  $('#location_status').attr('class', 'status ' + alertClass);
  $('#location_status').show();
}

function clearAlertStatus() {
  $('#location_status').html('');
  $('#location_status').attr('class', 'status');
  $('#location_status').hide();
}

function reverseGeocode() {
  if (!google || !google.maps.Geocoder) {
    alert($.t("It looks like you_re currently offline_ Please go online before searching_"));
  } else {
    app.googleMapsReady = true;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng: new google.maps.LatLng(app.latitude, app.longitude) }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK && results[1]) {
        app.readableLocation = results[1].formatted_address;
        $('#location').val(app.readableLocation);
        clearAlertStatus();
      } else {
        locationAlert('status-alert', $.t('Your location could not be found automatically_ Please specify it below_'));
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }
}

function justConfirmGoogleMapsLoaded() {
  if (!google || !google.maps.Geocoder) {
    alert($.t("It looks like you_re currently offline_ Please go online before searching_"));
  } else {
    app.googleMapsReady = true;
  }
}

function reloadLocale(newLocale) {
  $.i18n.init({
    lng: newLocale,
    resGetPath:"locales/__lng__/translation.json",
    fallbackLng: 'en',
    useDataAttrOptions: true
  }, function() {
    $('body').i18n();
  });
}

function replaceTranslatableFields(obj) {
  if(obj['translations'] != null) {
    $.each(_.keys(obj['translations']), function(index, key) {
      obj[key] = obj['translations'][key];
    });
  }
  return obj;
}

function iconFromTags(tagArray) {
  var iconName = '';
  $.each(tagArray, function(index, givenTag) {
    $.each(tags, function(index, tag) {
      if(givenTag == tag[0]) {
        iconName = tag[1];
      }
    });
  });
  return iconName;
}

function fullUrlWithProtocol(urlWithOrWithoutProtocol) {
  urlHasProtocol = urlWithOrWithoutProtocol.search(/^http(s)?\:\/\//);
  if(urlHasProtocol > -1) {
    return urlWithOrWithoutProtocol;
  } else {
    return "http://" + urlWithOrWithoutProtocol;
  }
}

function parseLinks(str) {
  str = str.replace(/(https?[\S]+[^\W])\s?/, "<a href=\"#\" onclick=\"window.open('$1', '_system');\">$1</a> ");
  str = str.replace(/([\S]+\@[\S]+(\.[\S]+)+[^\W])\s?/, "<a href='mailto:$1'>$1</a> ");
  return str;
}

function phoneContactLine(phone) {
  return '<i class="fa fa-phone fa-fw"></i>' + phone['digits'] + ((phone['phone_type'] != '' && phone['phone_type'] != null) ? ' (' + phone['phone_type'] + ')' : '');
}

function websiteContactLine(website) {
  var url = fullUrlWithProtocol(website);
  return '<i class="fa fa-external-link fa-fw"></i>' + '<a href="#" onclick="window.open(\'' + url + '\', \'_system\');">' + $.t('Website') + '</a>'
}

function locationBlockAndLink(location) {
  var text = location.address + (location.unit ? ', ' + location.unit : '') + '<br />' + location.city + ', ' + location.state + (location.zip_code ? ' ' + location.zip_code : '');
  var queryString = text.replace('<br />', ', ').replace(' ', '+');
  return '<a href="' + app.mapsPrefix + queryString + '">' + text + '</a>';
}

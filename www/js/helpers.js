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

function reverseGeocode() {
  var geocoder = new google.maps.Geocoder();
  navigator.geolocation.getCurrentPosition(function(position) {
    geocoder.geocode({ latLng: new google.maps.LatLng(position.coords.latitude, position.coords.longitude) }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK && results[1]) {
        $('#location').val(results[1].formatted_address);
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }, function(error) {
    // don't worry about error
  })
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

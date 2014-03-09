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
      allClosed = true;
      return;
    }
  });
  return allClosed;
}
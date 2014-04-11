var app = {

  latitude: 0,
  longitude: 0,
  readableLocation: '',
  googleMapsReady: false,
  mapsPrefix: '',

  // Application Constructor
  initialize: function() {
      this.bindEvents();
  },

  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
      document.addEventListener('offline', this.onOffline, false);
      document.addEventListener('resume', this.getPosition, false);
  },

  onDeviceReady: function() {
    reloadLocale('en'); // TODO: Replace this with a locally stored preference value.
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByName('gray');
    app.mapsPrefix = (device.platform == 'iOS' ? 'maps:q=' : 'geo:0,0+?q=');
    app.getPosition();
  },

  onOffline: function() {
    alert($.t("It looks like you_re currently offline_ Please go online before searching_"));
  },

  getPosition: function() {
    locationAlert('status-notice', $.t('Attempting to find your location automatically___'));
    // 'app' has to be used because 'this' is the current event in this scope
    navigator.geolocation.getCurrentPosition(app.successOnGetCurrentPosition, app.errorOnGetCurrentPosition);
  },

  successOnGetCurrentPosition: function(position) {
    app.latitude = position.coords.latitude;
    app.longitude = position.coords.longitude;
    if(!app.googleMapsReady) {
      app.loadGoogleMaps(true);
    } else {
      reverseGeocode();
    }
  },

  errorOnGetCurrentPosition: function() {
    locationAlert('status-alert', $.t("Your location could not be found automatically_ Please specify it below_"));
    if(!app.googleMapsReady) {
      app.loadGoogleMaps(false);
    }
  },

  loadGoogleMaps: function(callbackToGeocodeCoordinates) {
    var callback;
    if(callbackToGeocodeCoordinates) {
      callback = 'reverseGeocode';
    } else {
      callback = 'justConfirmGoogleMapsLoaded';
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=' + callback + '&key=' + GOOGLE['apiKey'];
    document.body.appendChild(script);
  }

};

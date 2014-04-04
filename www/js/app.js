var app = {
  // Application Constructor
  initialize: function() {
      this.bindEvents();
  },

  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
      document.addEventListener('offline', this.onOffline, false);
  },

  onDeviceReady: function() {
    reloadLocale('en');
    
    // var script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=reverseGeocode&key=' + GOOGLE['apiKey'];
    // document.body.appendChild(script);
  },

  onOffline: function() {
    alert("It looks like you're currently offline.");
  }
};

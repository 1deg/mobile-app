


$(document).on("deviceready", function() {
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByName("gray");

});

// $(document).on('ready', function() {
//   var c = new OneDegreeClient(ODRS['host'], ODRS['version'], ODRS['apiKey']);
//   var opps = c.findOpportunities('jobs', function(data) {
//     $.each(data['opportunities'], function(index, opp) {
//       $('#test_area').append(opp['title']);
//     });
//   });
// });

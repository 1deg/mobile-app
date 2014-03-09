var OneDegreeClient = function (odrsHost, odrsVersion, apiKey) {

  this.odrsHost = odrsHost;
  this.odrsVersion = odrsVersion;
  this.apiKey = apiKey;

  this.findOpportunities = function(query, callback) {
    return $.getJSON(url('opportunities'), fullParams({ 'query[text]': query }), callback);
  }

  var url = function(path) {
    return odrsHost + '/' + odrsVersion + '/' + path
  }

  var fullParams = function(params) {
    params.api_key = apiKey;
    return params;
  }

}

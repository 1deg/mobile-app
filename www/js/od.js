var OneDegreeClient = function (odrsHost, odrsVersion, apiKey) {

  this.odrsHost = odrsHost;
  this.odrsVersion = odrsVersion;
  this.apiKey = apiKey;

  this.findOpportunities = function(query, callback) {
    return $.getJSON(url(['opportunities']), fullParams({ 'query[text]': query }), callback);
  }

  this.getTranslations = function(pathArrayToObject, languageCode, callback) {
    pathArrayToObject.push('translations');
    pathArrayToObject.push(languageCode);
    return $.getJSON(url(pathArrayToObject), fullParams({}), callback);
  }

  var url = function(pathArray) {
    pathArray.splice(0, 0, odrsHost);
    pathArray.splice(1, 0, odrsVersion);
    return pathArray.join('/');
  }

  var fullParams = function(params) {
    params.api_key = apiKey;
    return params;
  }

}

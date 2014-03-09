var OneDegreeClient = function (odrsHost, odrsVersion, apiKey) {

  this.odrsHost = odrsHost;
  this.odrsVersion = odrsVersion;
  this.apiKey = apiKey;

  this.findOpportunities = function(query, languageCode, callback) {
    $.getJSON(url(['opportunities']), fullParams({ 'query[text]': query }), callback);
  }

  this.getOrganization = function(id, languageCode, callback) {
    $.getJSON(url(['organizations', id]), fullParams({}), callback);
  }

  this.getOpportunity = function(organizationID, id, languageCode, callback) {
    $.getJSON(url(['organizations', organizationID, 'opportunities', id]), fullParams({}), callback);
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

var OneDegreeClient = function (odrsHost, odrsVersion, apiKey) {

  this.odrsHost = odrsHost;
  this.odrsVersion = odrsVersion;
  this.apiKey = apiKey;

  this.findOpportunities = function(query, languageCode, callback) {
    var params = {
      'query[text]': query.searchTerm,
      'query[lat]': query.lat,
      'query[long]': query.lon,
      'query[distance]': query.distance
    };
    if (languageCode != "en") {
      params['locale'] = languageCode;
    }
    $.getJSON(url(['opportunities']), fullParams(params), callback);
  }

  this.getOrganization = function(id, languageCode, callback) {
    var params = {};
    if (languageCode != "en") {
      params['locale'] = languageCode;
    }
    $.getJSON(url(['organizations', id]), fullParams(params), callback);
  }

  this.getOpportunity = function(organizationID, id, languageCode, callback) {
    var params = {};
    if (languageCode != "en") {
      params['locale'] = languageCode;
    }
    $.getJSON(url(['organizations', organizationID, 'opportunities', id]), fullParams(params), callback);
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

module.exports = {

  apiKey: '87c00245aa4be44f589fe378a50dc13c',
  cacheTimeInMin: 2,

  getData: function(callback) {
    var _this = this;
    var request = require('request');
    var options  = {
      baseUrl : 'http://api.openweathermap.org/',
      uri : 'data/2.5/forecast?q=' + this.playlistitem.weatherLocation + '&APPID=' + this.apiKey,
      method : 'GET',
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          _this.data = JSON.parse(body);
        } else {
          sails.log.warn(error);
          sails.log.warn(response);
          sails.log.warn(body);
        }
        callback();
    });
  },

}

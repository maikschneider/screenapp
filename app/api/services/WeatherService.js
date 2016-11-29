module.exports = {

  playlistitem: null,

  /**
   * WeatherService
   * @param  {PlaylistItem} playlistitem (the item with appType weather)
   * @return {boolean} true on success, false on failure
   *
   *  0. init
   *  1. run       check Cache
   *  2. update    WeatherData
   *  3. get       WeatherData
   *  4. save      WeatherData
   *  5. broadcast WeatherData
   */
  init: function(playlistitemId) {

    sails.log.info('WeatherService: init()');
    var _this = this;

    PlaylistItem.findOne(playlistitemId).then(function(playlistitem){
      _this.playlistitem = playlistitem;
      _this.apiKey = '87c00245aa4be44f589fe378a50dc13c';
      _this.data = null;
      _this.cacheTimeInMin = 2;

      _this.run();
    }).catch(function(err){
      sails.log.err('No PlaylistItem with ID ' + playlistitemId + ' was found.');
    });
  },

  run: function() {
    if(this.needDataUpdate()){
      this.updateWeatherData();
    } else {

    }
  },

  needDataUpdate: function() {
    var doUpdate = false;

    // check for empty data
    if(typeof(this.playlistitem.data) === 'undefined') doUpdate = true;
    if(this.playlistitem.data == []) doUpdate = true;
    if(this.playlistitem.data == {}) doUpdate = true;
    if(this.playlistitem.data == false) doUpdate = true;

    // check for outdated cache
    var add_minutes =  function (dt, minutes) {
        return new Date(dt.getTime() + minutes*60000);
    }
    var cacheDateUntil = add_minutes(this.playlistitem.updatedAt, this.cacheTimeInMin);
    var nowDate = new Date();
    if(nowDate.getTime() > cacheDateUntil.getTime()) doUpdate = true;

    return doUpdate;
  },

  updateWeatherData: function() {
    var callback = this.saveWeatherData;
    this.getWeatherData(callback);
  },

  saveWeatherData: function() {
    var _this = this;
    // Update Item
    PlaylistItem.update({id: this.playlistitem.id}).set({data: _this.data}).exec(function(err, updatedPlaylistitems){
      if(err){
        console.log(err);
      }

      // broadcast a message to subscribers with updated data
      sails.sockets.broadcast('playlistsocket'+updatedPlaylistitems[0].playlist, 'itemUpdate', {item: updatedPlaylistitems[0]});

    });
  },

  getWeatherData: function(callback) {
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
  }

}

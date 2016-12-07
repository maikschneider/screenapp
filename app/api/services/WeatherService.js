module.exports = {

  playlistitem: null,
  apiKey: '87c00245aa4be44f589fe378a50dc13c',
  data: null,
  cacheTimeInMin: 2,

  runAndSave: function(playlistitemId) {
    sails.log.info('WeatherService: runAndSave('+playlistitemId+')');
    this.init(playlistitemId, this.updatePlaylistitem);
  },

  runBeforeCreate: function(values, callback) {
    sails.log.info('WeatherService: runBeforeCreate()');
    var _this = this;

    this.playlistitem = values;

    _this.getWeatherData(function(){
      values.data = _this.data;
      callback();
    });

  },

  runBeforeUpdate: function(values, callback) {
    sails.log.info('WeatherService: runBeforeUpdate('+values.id+')');
    var _this = this;

    // get old item from database
    this.init(values.id, function(){
      // if location changed or cachetime is over
      if(values.weatherLocation != _this.playlistitem.weatherLocation || _this.needDataUpdate()){
        // set to new location
        _this.playlistitem.weatherLocation = values.weatherLocation;

        _this.getWeatherData(function(){
          values.data = _this.data;
          callback();
        });
      } else {
        callback();
      }
    });

  },

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
  init: function(playlistitemId, callback) {

    var _this = this;

    PlaylistItem.findOne(playlistitemId).then(function(playlistitem){
      _this.playlistitem = playlistitem;

      callback();
    }).catch(function(err){
      sails.log.warn('No PlaylistItem with ID ' + playlistitemId + ' was found.');
      sails.log.warn(err);
    });
  },

  updatePlaylistitem: function() {
    if(this.needDataUpdate()){
      var callback = this.saveWeatherData;
      this.getWeatherData(callback);
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

  saveWeatherData: function() {
    var _this = this;
    // Update Item
    PlaylistItem.update({id: this.playlistitem.id}).set({data: _this.data}).exec(function(err, updatedPlaylistitems){
      if(err){
        console.log(err);
      }

      // broadcast a message to subscribers with updated data
      _this.publishUpdate(updatedPlaylistitems[0]);

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
  },

  publishUpdate: function(playlistitem, callback) {

    sails.hooks.views.render('screen/weather', {layout: false, item: playlistitem}, function(err,html){
      if(err) sails.log.warn(err);
      sails.sockets.broadcast('playlistsocket'+playlistitem.playlist, 'itemUpdate', {'item': playlistitem, 'html': html});
      if(callback) callback();
    });

  }

}

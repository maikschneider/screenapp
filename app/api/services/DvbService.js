var dvb = require('dvbjs');

module.exports = {

  cacheTimeInMin: 1,

  runAndSave: function(playlistitemId) {
    sails.log.info('DvBService: runAndSave('+playlistitemId+')');
    this.init(playlistitemId, this.updatePlaylistitem);
  },

  runBeforeCreate: function(values, callback) {
    sails.log.info('DvbService: runBeforeCreate()');
    var _this = this;

    this.playlistitem = values;

    _this.getDvbData(function(){
      values.data = _this.data;
      callback();
    });

  },

  runBeforeUpdate: function(values, callback) {
    sails.log.info('DvbService: runBeforeUpdate('+values.id+')');
    var _this = this;

    // get old item from database
    this.init(values.id, function(){
      // if location changed or cachetime is over
      if(values.dvbStop != _this.playlistitem.dvbStop || _this.needDataUpdate()){
        // set to new location
        _this.playlistitem.dvbStop = values.dvbStop;

        _this.getDvbData(function(){
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
      var callback = this.saveDvbData;
      this.getDvbData(callback);
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

  saveDvbData: function() {
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

  getDvbData: function(callback) {
    var _this = this;
    var stopName = this.playlistitem.dvbStop;
    var timeOffset = 0;
    var numResults = 12;

    dvb.monitor(stopName, timeOffset, numResults, function(err, data) {
        if (err) {
          sails.log.error(err);
        }
        sails.log.info(data);
        if(data) _this.data = data;
        callback();
    });
  },

  publishUpdate: function(playlistitem, callback) {

    sails.hooks.views.render('screen/dvb', {layout: false, item: playlistitem}, function(err,html){
      if(err) sails.log.warn(err);
      sails.sockets.broadcast('playlistsocket'+playlistitem.playlist, 'itemUpdate', {'item': playlistitem, 'html': html});
      if(callback) callback();
    });

  }

}

var s = require("underscore.string");

module.exports = {

  playlistitem: null,
  data: null,
  cacheTimeInMin: 1,
  concreteService: null,

  _setup(playlistitem, callback) {
    sails.log.info('AppService:setup('+playlistitem.id+')');
    this.playlistitem = playlistitem;
    this._setupConcreteService();
    callback();
  },

  _setupWithId(playlistitemId, callback) {
    sails.log.info('AppService: _setupWithId()');
    var _this = this;

    PlaylistItem.findOne(playlistitemId).then(function(playlistitem){

      _this._setup(playlistitem, callback);

    }).catch(function(err){
      sails.log.warn('AppService:setupWithId() No PlaylistItem with ID ' + playlistitemId + ' was found.');
      sails.log.warn(err);
    });
  },

  _setupConcreteService: function() {
    sails.log.info('AppService: _setupConcreteService()');
    var serviceName = s.capitalize(this.playlistitem.appType)+'Service';

    if(_.isUndefined(global[serviceName])) {
      sails.log.error('No Service "'+serviceName+'" found.');
    }

    this.concreteService = global[serviceName];
    this.concreteService.playlistitem = this.playlistitem;
  },

  runUpdate: function(playlistitemId) {
    sails.log.info('AppService: runUpdate('+playlistitemId+')');
    var _this = this;

    _this._setupWithId(playlistitemId, function(){
      _this.initUpdate(function(){
        _this.saveData();
      });
    });
  },

  runBeforeCreate: function(values, callback) {
    sails.log.info('AppService: runBeforeCreate()');
    var _this = this;

    _this._setup(values, function(){
      _this.performUpdate(function(){
        values.data = _this.data;
        callback();
      });
    });
  },

  // runBeforeUpdate: function(values, callback) {
  //   sails.log.info('AppService: runBeforeUpdate('+values.id+')');
  //   var _this = this;

  //   // get old item from database
  //   this.init(values.id, function(){
  //     // if location changed or cachetime is over
  //     if(values.weatherLocation != _this.playlistitem.weatherLocation || _this.needDataUpdate()){
  //       // set to new location
  //       _this.playlistitem.weatherLocation = values.weatherLocation;

  //       _this.getWeatherData(function(){
  //         values.data = _this.data;
  //         callback();
  //       });
  //     } else {
  //       callback();
  //     }
  //   });

  // },

  // /**
  //  * AppService
  //  * @param  {PlaylistItem} playlistitem (the item with appType weather)
  //  * @return {boolean} true on success, false on failure
  //  *
  //  *  1. run       check Cache
  //  *  2. update    WeatherData
  //  *  3. get       WeatherData
  //  *  4. save      WeatherData
  //  *  5. broadcast WeatherData
  //  */

  /**
   * beforeUpdate Hook
   * @param  {Function} callback
   */
  beforeUpdate: function(callback){
    sails.log.debug('AppService:beforeUpdate()');
    callback();
  },

  initUpdate: function(next) {
    sails.log.info('AppService: initUpdate()');
    var _this = this;
    // check if update is necessary
    if(_this._needDataUpdate()){
      // invoke beforeUpdate hook
      _this.beforeUpdate(function(){
         _this.performUpdate(next);
      });
    }
  },

  performUpdate: function(next){
    sails.log.info('AppService:performUpdate()');
    var _this = this;
    _this.concreteService.getData(function(){
      // obtain received data from concreteService
      _this.data = _this.concreteService.data;
      // invoke afterUpdate hook
      _this.afterUpdate(next);
    });
  },

  /**
   * afterUpdate Hook
   * @param  {Function} callback
   */
  afterUpdate: function(callback){
    sails.log.debug('AppService:afterUpdate()');
    callback();
  },


  _needDataUpdate: function() {
    sails.log.info('AppService:_needDataUpdate()');
    // check for empty data
    if(_.isUndefined(this.playlistitem.data)) return true;
    if(this.playlistitem.data == []) return true;
    if(this.playlistitem.data == {}) return true;
    if(this.playlistitem.data == false) return true;

    // check for outdated cache
    var add_minutes =  function (dt, minutes) {
        return new Date(dt.getTime() + minutes*60000);
    }
    var cacheDateUntil = add_minutes(this.playlistitem.updatedAt, this.cacheTimeInMin);
    var nowDate = new Date();
    if(nowDate.getTime() > cacheDateUntil.getTime()) return true;

    return false;
  },

  saveData: function() {
    sails.log.info('AppService:saveData()');
    var _this = this;
    // Update Item
    PlaylistItem.update({id: this.playlistitem.id}).set({data: _this.data}).exec(function(err, updatedPlaylistitems){
      if(err){
        sails.log.log(err);
      }

      // broadcast a message to subscribers with updated data
      _this.publishUpdate(updatedPlaylistitems[0]);

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

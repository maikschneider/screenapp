'use strict';

var s = require("underscore.string");

module.exports = class BaseAppService {

  constructor(){
    this.playlistitem = null;
    this.data = null;
    this.cacheTimeInMin = 1;
  }

  /**
   * Updates PlaylistItem data and saves it
   * @param  {integer} playlistitemId The id of the PlaylistItem to update
   */
  runUpdate(playlistitemId) {
    sails.log.info('BaseAppService: runUpdate('+playlistitemId+')');
    var _this = this;

    _this._setupById(playlistitemId, function(){
      _this.initUpdate(function(){
        _this.saveData();
      });
    });
  }

  /**
   * Gets Item data to inject into creation lifecycle
   * @param  {object}   values   Playlistitem object before it is created
   * @param  {Function} callback the callback from the lifecycle hook
   */
  runBeforeCreate(values, callback) {
    sails.log.info('BaseAppService: runBeforeCreate()');
    var _this = this;

    _this._setup(values, function(){
      _this.performUpdate(function(){
        values.data = _this.data;
        callback();
      });
    });
  }

  /**
   * Gets Item data to inject into update lifecycle
   * @param  {object}   values   Playlistitem object before it is saved
   * @param  {Function} callback
   */
  runBeforeUpdate(values, callback) {
    sails.log.info('BaseAppService: runBeforeUpdate('+values.id+')');
    var _this = this;

    // @todo: use _setupById to get previous item version and compare changed values
    _this._setup(values, function(){
      _this.performUpdate(function(){
        values.data = _this.data;
        callback();
      });
    });
  }

  /**
   * Gets PlaylistItem from Database before it continues with setup
   * @param  {integer}   playlistitemId id of the PlaylistItem to update
   * @param  {Function} callback
   */
  _setupById(playlistitemId, callback) {
    sails.log.info('BaseAppService: _setupById()');
    var _this = this;

    PlaylistItem.findOne(playlistitemId).then(function(playlistitem){

      _this._setup(playlistitem, callback);

    }).catch(function(err){
      sails.log.warn('BaseAppService:setupWithId() No PlaylistItem with ID ' + playlistitemId + ' was found.');
      sails.log.warn(err);
    });
  }

  /**
   * Initilizes class attributes
   * @param  {[type]}   playlistitem [description]
   * @param  {Function} callback     [description]
   * @return {[type]}                [description]
   */
  _setup(playlistitem, callback) {
    sails.log.info('BaseAppService:setup('+playlistitem.id+')');
    this.playlistitem = playlistitem;
    //this._setupConcreteService();
    callback();
  }

  /**
   * Sets the concrete API Service (e.g. TwitterService) and its overrides
   */
  _setupConcreteService() {
    sails.log.info('BaseAppService: _setupConcreteService()');
    // var serviceName = s.capitalize(this.playlistitem.appType)+'Service';

    // if(_.isUndefined(global[serviceName])) {
    //   sails.log.error('No Service "'+serviceName+'" found.');
    // }

    // this.concreteService = global[serviceName];
    // for(property in this.concreteService) {
    //   this[property] = this.concreteService[property];
    // }
    // this.concreteService.playlistitem = this.playlistitem;
  }

  /**
   * Checks wheter to update and invokes beforeUpdate hook
   * @param  {Function} next callback
   */
  initUpdate(next) {
    sails.log.info('BaseAppService: initUpdate()');
    var _this = this;
    // check if update is necessary
    if(_this._needDataUpdate()){
      // invoke beforeUpdate hook
      _this.beforeUpdate(function(){
         _this.performUpdate(next);
      });
    }
  }

  /**
   * beforeUpdate Hook
   * @param  {Function} callback
   */
  beforeUpdate(callback){
    sails.log.debug('BaseAppService:beforeUpdate()');
    callback();
  }

  /**
   * Checks for corrupt data and cache time
   * @return {boolean} returns true if update is recommended
   */
  _needDataUpdate() {
    sails.log.info('BaseAppService:_needDataUpdate()');
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
  }

  /**
   * Calls getData() from the concrete API Service, e.g. TwitterService:getData() and invokes the afterUpdate hook
   * @param  {Function} next callback
   */
  performUpdate(next){
    sails.log.info('BaseAppService:performUpdate()');
    var _this = this;
    _this.getData(function(){
      // invoke afterUpdate hook
      _this.afterUpdate(next);
    });
  }

  /**
   * getData from API
   * @param  {Function} callback
   */
  getData(callback){
    sails.log.debug('BaseAppService:getData()');
    callback();
  }

  /**
   * afterUpdate Hook
   * @param  {Function} callback
   */
  afterUpdate(callback){
    sails.log.debug('BaseAppService:afterUpdate()');
    callback();
  }

  /**
   * Writes the data attribute of the current PlaylistItem to the Database and publishes an Update
   */
  saveData() {
    sails.log.info('BaseAppService:saveData()');
    var _this = this;
    // Update Item
    PlaylistItem.update({id: this.playlistitem.id}).set({data: _this.data}).exec(function(err, updatedPlaylistitems){
      if(err){
        sails.log.log(err);
      }
    });
  }

  /**
   * Broadcasts the 'itemUpdate' socket event with the item and rendered html  partial
   * @param  {object}   playlistitem the item to publish the update for
   * @param  {Function} callback
   */
  publishUpdate(playlistitem, callback) {

    sails.hooks.views.render('screen/'+playlistitem.appType, {layout: false, item: playlistitem}, function(err,html){
      if(err) sails.log.warn(err);
      sails.sockets.broadcast('playlistsocket'+playlistitem.playlist, 'itemUpdate', {'item': playlistitem, 'html': html});
      if(callback) callback();
    });

  }

}

module.exports = {

    isStarted: false,
    onAir: {
      /*
      playlistID11: {
        timeLeft: 30,     // playlistitem duration that gets decreased
        nextItem: 0       // offset of the next playlistitem
      }
      */
    },

    runService: function(playlistitem) {

      switch(playlistitem.appType) {

        case 'twitter':
          TwitterService.run(playlistitem);
          break;
        case 'weather':
          WeatherService.init(playlistitem.id);
          break;
        default:
          //@todo return something
      }
    },

    startCron: function() {
      if(this.isStarted) return false;

      sails.log.info('Starting Cron');

      var _this = this;
      var schedule = require('node-schedule');

      var j = schedule.scheduleJob('*/5 * * * * *', function(){
        _this.tick();
      });

      this.isStarted = true;
    },

    /**
     * Called from cron job
     */
    tick: function() {

      _this = this;

      sails.log.info(this.onAir);

      _.each(this.onAir, function(playlistData, playlistID){
        _this.onAir[playlistID].timeLeft -= 5;
        if(_this.onAir[playlistID].timeLeft <= 0) _this.triggerSlideChange(playlistID);
      });

    },

    triggerSlideChange: function(playlistID) {
      sails.log.info('BroadcastsService:triggerSlideChange()');
      var _this = this;
      Playlist.findOne(playlistID).populate('items').then(function(playlist){

        // check Playlist for items
        if(_this.validatePlaylistItems(playlist)) return false;

        // broadcast slidechange to playlist room
        sails.sockets.broadcast('playlistsocket'+playlist.id, 'slideChange', {item: _this.onAir[playlistID].nextItem});

        _this.afterSlideChange(playlist);

      }).catch(function(err){
        sails.log.warn(err);
      });

    },

    /**
     * Set next item, trigger Service API
     * @param  {Playlidt} playlist
     */
    afterSlideChange: function(playlist) {

        // set next item and duration
        this.onAir[playlist.id].timeLeft = playlist.items[this.onAir[playlist.id].nextItem].duration;
        var nextItem = this.onAir[playlist.id].nextItem + 1;
        this.onAir[playlist.id].nextItem = playlist.items.length == nextItem ? 0 : nextItem;

        // run API for next item
        var nextItemOffset = this.onAir[playlist.id].nextItem;
        this.runService(playlist.items[nextItemOffset]);

    },

    initPlaylist: function(playlist) {

      sails.log.info(this.onAir);

      if(this._isOnAir(playlist)){
        sails.log.info('Playlist ' + playlist.id + ' already in broadcast queue.');
        return false;
      }

      if(this.validatePlaylistItems(playlist)) return false;

      this.onAir[playlist.id] = {
        timeLeft: playlist.items[0].duration,
        nextItem: (playlist.items.length > 1) ? 1 : 0,
      };

      if(!this.isStarted) this.startCron();

      sails.log.info('BroadcastsService: Added Playlist ' + playlist.id);
    },

    /**
     * If Playlist has no Items, it becomes removed
     * @param  {Playlist} playlist
     * @return {Boolean}
     */
    validatePlaylistItems: function(playlist) {
      if(_.isUndefined(playlist.items) || playlist.items.length<1){
        sails.log.info('Playlist '+ playlist.id +' has no items');
        this.stopPlaylist(playlist);
        return true;
      }
      return false;
    },

    _isOnAir: function(playlist) {
      return _.isUndefined(this.onAir[playlist.id]) ? false : true;
    },

    stopPlaylist: function(playlist) {
      if(!this._isOnAir(playlist)) return false;
      delete this.onAir[playlist.id];
    }




}
